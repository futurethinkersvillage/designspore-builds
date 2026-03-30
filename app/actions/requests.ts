"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { changeRequests, clientInfoRequests, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

type Result = { success: true; message: string; id?: string } | { success: false; error: string };

export async function submitChangeRequest(data: {
  moduleId?: string;
  type: "content-change" | "design-tweak" | "bug-issue" | "new-feature";
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  pageUrl?: string;
}): Promise<Result> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Missing user ID." };

  if (!data.title.trim()) return { success: false, error: "Title is required." };
  if (!data.description.trim()) return { success: false, error: "Description is required." };

  const id = crypto.randomUUID();
  await db.insert(changeRequests).values({
    id,
    userId: user.id,
    moduleId: data.moduleId ?? null,
    type: data.type,
    priority: data.priority,
    status: "new",
    title: data.title.trim(),
    description: data.description.trim(),
    pageUrl: data.pageUrl?.trim() || null,
  });

  // Send Discord notification if webhook is set
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    const userName = (session.user as { name?: string }).name ?? "Unknown client";
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🔔 **New Change Request** — ${userName}\n**[${data.priority.toUpperCase()}] ${data.title}**\nType: ${data.type}\n${data.pageUrl ? `Page: ${data.pageUrl}` : ""}`,
        }),
      });
    } catch { /* non-fatal */ }
  }

  revalidatePath("/requests");
  revalidatePath("/admin/requests");
  return { success: true, message: "Request submitted. Mike will review it shortly.", id };
}

export async function respondToInfoRequest(requestId: string, responseText: string): Promise<Result> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };
  const user = session.user as { id?: string };
  if (!user.id) return { success: false, error: "Missing user ID." };

  if (!responseText.trim()) return { success: false, error: "Response cannot be empty." };

  const [row] = await db
    .select({ id: clientInfoRequests.id })
    .from(clientInfoRequests)
    .where(and(eq(clientInfoRequests.id, requestId), eq(clientInfoRequests.userId, user.id)));

  if (!row) return { success: false, error: "Request not found." };

  await db.update(clientInfoRequests)
    .set({ responseText: responseText.trim(), isResolved: true, respondedAt: new Date() })
    .where(eq(clientInfoRequests.id, requestId));

  revalidatePath("/dashboard");
  return { success: true, message: "Response sent." };
}

// ── Admin actions ─────────────────────────────────────────────────────────

const ADMIN_EMAILS = ["mike@designspore.co", "futurethinkerspodcast@gmail.com", "mikenoises@gmail.com"];

async function assertAdmin(): Promise<{ id: string; email: string } | null> {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as { id?: string; email?: string | null };
  if (!ADMIN_EMAILS.includes(user.email ?? "")) return null;
  return { id: user.id!, email: user.email! };
}

export async function updateChangeRequestStatus(
  requestId: string,
  status: "new" | "in-review" | "in-progress" | "resolved" | "closed",
  clientUpdate?: string,
  adminNotes?: string,
): Promise<Result> {
  const admin = await assertAdmin();
  if (!admin) return { success: false, error: "Unauthorized." };

  const updates = {
    status,
    updatedAt: new Date(),
    ...(clientUpdate !== undefined && { clientUpdate }),
    ...(adminNotes !== undefined && { adminNotes }),
    ...(status === "resolved" && { resolvedAt: new Date() }),
  };

  await db.update(changeRequests).set(updates).where(eq(changeRequests.id, requestId));
  revalidatePath("/admin/requests");
  return { success: true, message: "Request updated." };
}

export async function generateTaskFile(requestId: string): Promise<Result> {
  const admin = await assertAdmin();
  if (!admin) return { success: false, error: "Unauthorized." };

  const [req] = await db
    .select()
    .from(changeRequests)
    .where(eq(changeRequests.id, requestId));

  if (!req) return { success: false, error: "Request not found." };

  const [client] = await db
    .select({ name: users.name, email: users.email, businessName: users.businessName })
    .from(users)
    .where(eq(users.id, req.userId));

  const clientSlug = (client?.businessName ?? client?.name ?? client?.email ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const basePath = process.env.TASK_FILES_PATH ?? "/data/designspore/tasks";
  const clientDir = path.join(basePath, clientSlug);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `${date}-${req.type}-${req.id.slice(0, 8)}.md`;
  const filePath = path.join(clientDir, filename);

  const content = `# ${req.title}

**Client:** ${client?.name ?? client?.email ?? "Unknown"}
**Business:** ${client?.businessName ?? "—"}
**Date:** ${date}
**Type:** ${req.type}
**Priority:** ${req.priority}
**Status:** ${req.status}
${req.pageUrl ? `**Page:** ${req.pageUrl}  ` : ""}
${req.moduleId ? `**Service:** ${req.moduleId}  ` : ""}

## Description

${req.description}

## Admin Notes

${req.adminNotes ?? "_No notes yet._"}

## Task Log

- [ ] Review request
- [ ] Implement changes
- [ ] Update client status
- [ ] Mark resolved

---
_Generated by DesignSpore portal · Request ID: ${req.id}_
`;

  try {
    await mkdir(clientDir, { recursive: true });
    await writeFile(filePath, content, "utf-8");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Write failed";
    return { success: false, error: `Could not write file: ${msg}` };
  }

  await db.update(changeRequests)
    .set({ taskFilePath: filePath, updatedAt: new Date() })
    .where(eq(changeRequests.id, requestId));

  revalidatePath("/admin/requests");
  return { success: true, message: `Task file created at ${filePath}` };
}

export async function createClientInfoRequest(data: {
  userId: string;
  moduleId?: string;
  message: string;
  dueDate?: Date;
}): Promise<Result> {
  const admin = await assertAdmin();
  if (!admin) return { success: false, error: "Unauthorized." };

  if (!data.message.trim()) return { success: false, error: "Message is required." };

  const id = crypto.randomUUID();
  await db.insert(clientInfoRequests).values({
    id,
    userId: data.userId,
    moduleId: data.moduleId ?? null,
    message: data.message.trim(),
    dueDate: data.dueDate ?? null,
  });

  revalidatePath("/admin/requests");
  return { success: true, message: "Info request sent to client.", id };
}
