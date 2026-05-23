export type TranscriptParagraph = { text: string; aside?: boolean };

export type TranscriptSection = {
  heading?: string;
  paragraphs: TranscriptParagraph[];
};

export const transcript: TranscriptSection[] = [
  {
    heading: "Voices from the community",
    paragraphs: [
      {
        text: "\"What's really cool about what they're doing, different from a lot of these communities that just want to survive, is they're working actively to make the greater community more resilient and more likely to survive in the more AI-defined future. They're giving the people that have this propensity to making the world a better place more agency and freedom to do the things — to nudge the world in the right direction.\"",
        aside: true,
      },
      {
        text: "\"There are waves of people just turning to each other and finding community. All the sense-making over the past decade is small community. And I think this project is hitting a really interesting intersection of the most deep-green granola folk and the people who are just recognizing that shit's hitting the fan and they need somewhere to go. Everyone needs community.\"",
        aside: true,
      },
      {
        text: "\"If people can engage in something that is productive and brings people together, and we can dance our feet off like we used to do, and get to know each other and exchange vegetables and knowledge, eat together and tell stories like the old grandmas used to do in the wintertime, then I think we will attract a whole bunch of people.\"",
        aside: true,
      },
    ],
  },
  {
    heading: "Introduction",
    paragraphs: [
      { text: "Most people are asking, how do I survive the future? But I think the better question to ask is: how do we build places where the future is actually worth living?" },
      { text: "In this video, I'm going to show you an early demo of the Smart Village dashboard we've been building for our 400-acre property in British Columbia. But this is really about something much bigger than software." },
      { text: "The question behind the project is: how do we build resilient communities in a world where AI, automation, economic instability, and institutional failure are all accelerating at the same time?" },
      { text: "There's a desperate need out there for experimentation with technology and land-based projects that seek to answer questions like: If Western civilization collapses, what comes next? What would we design into the new civilization? How do we approach food, energy, housing, education, and health in a post-AI era? What values, principles, and systems do micro-civilizations need to actually function? Can AI be used to help people coordinate, govern better, steward land, and manage resources? How are the fundamental building blocks of a society that has AI and robots different from those that don't? How do we build AI that aids us in becoming more resilient, skillful, and capable instead of weak, dumb, and dependent?" },
      { text: "That's what we're trying to understand. For the last few years we've been developing our land as a real test bed for a different way of living. It's part campground, part village, part maker space, part resilience lab." },
      { text: "Over the last couple of months I've been building AI tools to help coordinate the whole thing — tools for governance, funding, membership, work stays, task bounties, farm sensors, tool tracking, event planning, energy use, maintenance, and eventually a network of villages that people can move between seasonally." },
      { text: "The idea is not for AI to replace human life. Actually, it's the opposite — to use AI to take care of the coordination burden so people can spend more time building and learning, raising kids, growing food, making music, hosting gatherings, and becoming more capable together." },
      { text: "In this conversation, I walk our local resilience group through the dashboard, and we get into a much bigger discussion about AI, community, governance, work, parenting, festivals, land, funding, and what resilience might actually look like in the next decade." },
      { text: "This is early, but I think it's one of the clearest glimpses we've had so far into where the future is headed in a post-AI era. Enjoy." },
    ],
  },
  {
    heading: "Backstory",
    paragraphs: [
      { text: "Just a little bit of backstory for anyone who doesn't know. We crowdfunded this land through our network in Wells Gray, British Columbia, Canada. It's a 400-acre property and we're building what we're calling a smart village." },
      { text: "Up until last year we were hosting events and campers, and we've been quietly working on building things and upgrading the infrastructure on the land over the last few years. We replaced multiple pumps. We started a garden. We repaired some of the electrical and septic systems. We built a sauna and a geodesic dome, and we hosted a number of small community events." },
      { text: "It's really been five years of learning how to be on land, because pretty much none of us had done anything like this before. So this has been a really big learning curve. But in the last year, with artificial intelligence, we've been able to do a lot more. I've been working on systems for the village project, building dashboards for our team — tools we're starting to use on the land." },
      { text: "We're looking to raise some capital for the land, the network, and this software that I'm building. We're also looking to acquire more land — potentially in the south: Colombia, Argentina, somewhere around those areas. With this next phase of investment, we're going to build a larger maker space so we can produce cabins and tiny homes on the land, and host community build workshops and educational programs." },
      { text: "We're looking to expand this network and bring in other RV campsites and resorts, and start working towards a long-term off-grid, sustainable, food-sovereign — among many other things — network of villages." },
      { text: "So that's a brief intro into our project and the network. Next I'm going to walk through the Village Stack dashboard, and then we can open it up to discussion." },
    ],
  },
  {
    heading: "Overview Dashboard",
    paragraphs: [
      { text: "This is the overview page. It's really just giving you everything from the rest of the dashboard in one place so you can get an at-a-glance look at what's going on in your village. It shows you the number of members, monthly revenue, active projects on the land. It also shows your occupancy rate, your energy, your self-sufficiency, and the overall community health — we're actually tracking the sentiment and well-being of the people on the land so we can always have instant feedback and insight into what will improve people's lives there." },
    ],
  },
  {
    heading: "Fundraising",
    paragraphs: [
      { text: "Any project like this requires funding, and it's not a small amount when you're trying to acquire land and do large-scale infrastructure build-outs. This next dashboard is about fundraising and fund management." },
      { text: "There are three sections. The first is where you manage investors and capital and see how the money's being allocated and which investors are active. This is also where you can update existing investors on the project and let them know what's going on if they're not on the land with you." },
      { text: "The second tab is grants. One thing we want to do is host artist residencies — to have people come on the land, work on useful projects, make art together, make the place more beautiful to live in. Having traveled so much over the last 10 years, I've noticed that the places that attract people and thriving communities are the places with art and culture. So one way we think we can attract artists to the land is by hosting these artist grants. It imitates the XPRIZE-style funding system, where there are first, second, and third prizes for people to compete and work together on sprints to build useful things for the land." },
      { text: "The last tab is fund tracking and fund pooling for acquiring more land projects to join the network of villages. I'm getting AI agents to scrape the internet for real estate listings and private land for sale across BC and Alberta, but also in Central and South America. When it finds a place that would be suitable, it pulls it into the database, does more research on it, looks for information on infrastructure and amenities, then cross-references that across multiple listing sites to verify. Once it's in the dashboard, people can indicate whether they want to invest in that project and eventually pool funds together to acquire the land." },
    ],
  },
  {
    heading: "Governance",
    paragraphs: [
      { text: "The governance dashboard is probably the one I'm most excited about. I've been involved in the blockchain space for a number of years, and what I've learned is that decentralized governance is actually possible." },
      { text: "The question is: how do we make decisions as a large group of people in a way that is quick and efficient, takes stakeholders into account, and looks at the bigger picture of how people will actually be affected? A lot of these projects fall apart when one charismatic figurehead leader makes all the decisions for everybody." },
      { text: "A tool like this — with AI integrated at every level of decision-making — can actually make it a lot easier to make decisions as a group. We can bring in data from alternative sources. We can use AI to help with conflict mediation. We can have AI agents proactively making suggestions, helping write proposals, and working through all those edge cases when you're trying to make decisions as a group." },
      { text: "I've taken this a step further and implemented a concept called liquid democracy. Say your friend Priya knows more about alternative energy systems, and someone in the village proposes \"let's build a solar array.\" You don't personally care or know much about solar arrays, but you really agree with everything Priya says about solar energy — so you can actually delegate your vote to Priya on that specific subject. There can be delegated votes depending on what you're interested in and what you're not, with AI filtering through all of it and giving you feedback to move the process along." },
      { text: "In a modern village, everyone would have an AI agent that gets to know you and your preferences, so it can assist you on project planning, resolving conflicts, and making decisions. If you don't have a Priya who knows a lot about solar arrays, you can ask your agent to vote on these things on your behalf. You don't have to give total control away — you can give it an element of voting power on subjects you don't really care much about." },
      { text: "If you want to delegate your vote, you can press the delegate button, pass it on, or vote yourself. Say \"community garden expansion\" — I'm going to vote on that myself because I care about that subject; I'll do my research, I consent. Then \"emergency funds increase to $50K\" — I don't really care about that. AI votes. My dashboard's clear." },
      { text: "That's how it really should be, I think. It should be at that velocity. Everything I'm building with this governance tool is to increase the velocity of decision-making. The AI knows what's going on in the land, it knows the people on the land, it knows the other agents that are assisting the other people. It can figure out what's going to be most likely to make the proposal pass, what would actually get flagged, and it can help you write proposals that get green-lit more often." },
      { text: "As far as I've identified, when I've participated in online governance structures with blockchain companies, there are three basic types of governance that make the most sense: consent decision-making, advice, and lazy consensus." },
      { text: "Consent is basically standard voting. You can consent, abstain, or object. To pass a proposal, the majority has to agree." },
      { text: "Advice-based is when there are a handful of people who have domain expertise on the thing being proposed, and you have to consult them. If they give the go-ahead, the proposal can move ahead." },
      { text: "Lazy consensus means if nobody votes, it automatically gets approved. It's only based off raising concerns. If you click Raise Concern, it gets paused until there's a conversation — essentially moving it from lazy consensus over to consent decision-making." },
      { text: "I'm working on a mobile app, and it'll be a super-simple version of this dashboard. It'll notify you when there's a proposal; you can read it really quickly. There's a TLDR version of every proposal — an AI will summarize the proposal and think about you as well, what you care about, and customize it for you so you can make decisions quickly." },
      { text: "So many bureaucratic entities move so slow, take years to pass simple resolutions to problems, and I just want to try to speed this up. In my mind, a village is the smallest unit of a scalable democratic system. I want to test it there, and if this works, maybe we can bring this into larger organizations — companies, small-town government. When governments and the people involved start using AI for governance, I think the speed, transparency, fairness, and productivity is just going to be unbelievable." },
    ],
  },
  {
    heading: "Operations & Tasks",
    paragraphs: [
      { text: "Okay, I'm just going to quickly rip through the rest of these because there's a lot here." },
      { text: "Business and operations: if you've got a glamping business — like we do — it brings in all your revenue, monthly expenses, net income, and gives you a dashboard view of what's going on in your land." },
      { text: "I've built a task management system. This is a map of a demo piece of land, and all the tasks on the land are geo-linked to the map. The idea is to create a bounty system, so there's some sort of credit or monetary value to completing a task. People can just look at their phone, find a task nearby — each task has training associated with it, so there's a specific way to do it; you watch a video or read something to execute it. You claim it, finish it, it gets reviewed, moves to \"done,\" then you get the bounty." },
      { text: "In communities, not everyone wants to participate at the same level. Some people just want to pay for access. So rather than trying to make everyone do everything flatly and evenly — which nobody likes — there could be bounty systems where people get compensated and it can be hyper-efficient. It's almost like a game. Like Pokémon Go: walk around, look for tasks, check them off." },
    ],
  },
  {
    heading: "Events",
    paragraphs: [
      { text: "Anyone who's facilitated a party, event, gathering, or workshop knows how much work goes into it. So I built an AI agent that will brainstorm event ideas on the land. It'll find people who would be good at facilitating the event. It'll make sure everyone gets an invite. If people want to go for a hike, it'll ask the group if anyone can do ride-sharing and give people a lift to the location. It will research people in the area to try to find anyone who can facilitate a workshop, cultural event, live music — any number of things. This AI is very proactive, trying to facilitate regular cultural events so there's not a huge burden on a single person having to plan a thousand different things just to keep the village alive." },
      { text: "This idea is actually really central to culture, but funnily enough, AI is doing most of the work for it. It's just amazing what you can do with AI these days. They're incredibly smart. When you enable them to do things like this for you, it can be incredibly effective." },
      { text: "[Q: AI can propose all kinds of different things, and then if enough people say they're interested, it triggers it?]", aside: true },
      { text: "Yeah, that's exactly the idea. Obviously it won't go forward if only two people opt to go, but it tries to keep the calendar full so there's always a reason for people to check in." },
      { text: "[Aside: People underestimate the amount of effort, time, and money it takes to pay somebody to actually keep the spark alive in a WhatsApp group — you could do that with an agent too.]", aside: true },
      { text: "This project is so all-encompassing and touches so many different areas. This is my life's work. I've been thinking about this for 15 years at least, and my wife has been thinking about village and community design since she was a child. So this is definitely a long time coming." },
    ],
  },
  {
    heading: "Farm & IoT",
    paragraphs: [
      { text: "Farm and IoT is another really interesting one. I've been buying these little microchip ESP32 boards on AliExpress for a couple of bucks a piece, and I'm using them as LED controllers, as notification sensors when people come onto the property. I'm using them to track weather data, humidity, soil — basically anything I can attach a sensor to." },
      { text: "The idea is to gather data on long timescales. We don't know what AI is going to be capable of in the near future, but I imagine it being incredibly capable. The more data we can give it, the more information and context it can be aware of on the land, the better." },
      { text: "I know people think automatically that this is going to be some sort of hyper-surveillance state, but most people don't realize that you can have local AIs running on your own private servers that don't call home and don't share information. They can anonymize data if you choose to. You can have local mesh networks that privatize your entire network. I'm building now in anticipation of some of these functionalities coming online in the next couple of years." },
      { text: "I'm actually building a voice AI assistant into our walkie-talkie system, so you can switch to channel three on the walkie-talkie and get instant access to the village AI over voice. You might be out in the bush — let's say the chainsaw breaks down — and you can just ask the AI how to fix it on the spot." },
      { text: "We've used AI so much for machinery on the land. I've gone as far as describing the chunking sound that a tractor is making, and it knew it was the air filter that needed to be changed. It knows how to fix really old machines, and it can even source parts online for them. I've told it I need some bearing for some 1980s tractor, and it's been able to find parts and order them for me." },
      { text: "On the operations level, we're trying to keep an inventory of all the tools because we have thousands of tools and everything needs maintenance. Sometimes someone will take out a drill and forget to tell anyone, and then it goes missing for a month. I want to do a tracking system — almost like those Amazon stores in the States where you walk in, grab the food you want, walk out, and it bills you because it knows who you are. That's what I want to do with our tool-sharing program, so we always know who's got the tools at what time." },
      { text: "And the maintenance cycles — we've got 15 different machines that all require oil changes, filter changes, battery management, a ton of different things. Keeping an ongoing log of maintenance is something else I'm building into this AI, so someone who's not techy can just go to the voice assistant on the walkie-talkie and say, \"Hey, I changed the oil today. Keep track of it for me.\"" },
    ],
  },
  {
    heading: "Network",
    paragraphs: [
      { text: "Then there's the network map. You'd see all the different locations all over the world, and you'd be able to transfer your membership. I've been a digital nomad for about 10 years, and I always travel to places where there's existing community and where there's events. Sometimes you'll hear about some new hotspot in Colombia where all the digital-nomad online workers are going in the month of June. So you buy your ticket, go there, and you get this built-in social life and professional networking." },
      { text: "The digital-nomad movement that already exists could actually work with the villages. It wouldn't always be single guys working on their startups. It could be families, professionals — and people could move together and have this networked, synced-up, community vacation or travel schedule. You'd always have a location to go to in a village. There's a culture, there's a maker space, there's forest schooling for the kids, there's wellness facilities." },
      { text: "I used to work at Starbucks when I was a kid and I really got to love their training program because they created this experience that was just something you could expect in every location you visited. There are some things that could get really hardcore standardized: the type of workshops and education, the maker space, the wellness facilities, the events programming. Things like that could be replicated across all kinds of locations to make it easy and frictionless to move between them." },
    ],
  },
  {
    heading: "Energy",
    paragraphs: [
      { text: "I mentioned farm and IoT, and the same thing goes for energy. Our biggest expense in the summer months is usually energy, and it's often because a handful of people will leave their air conditioners on and go for a hike. I'm hoping to cut expenses by tracking it with cheap energy sensors." },
    ],
  },
  {
    heading: "Village Soul",
    paragraphs: [
      { text: "A constitution and a standard document for a village is really important. Every village would have a soul document. So this would be: What are we trying to do here? What's the purpose of this village? What values do we share?" },
      { text: "If an AI were to be proactive for us, what values would we want to bestow on that AI? It's like a shared document that everyone works on together — a Wikipedia page — and the AI uses that as its soul when it does things autonomously or works on tasks." },
      { text: "Whenever you have autonomous AIs working in a project like this, you need them to all be coherent around a set of principles, and that should be updatable, and people should be contributing to it all the time. That's what governance is going to look like in the future. As AI gets more and more intelligent, we might build the soul of the AI, and the AI will function almost like a new form of representative democracy — but with the directive, unlike the democracy we have today." },
    ],
  },
  {
    heading: "Agent Dashboard",
    paragraphs: [
      { text: "Finally, this is the agent dashboard. This is where you can check up on all the agents, see what responsibilities and tasks they have and are working on. If you have a question for one of the agents, you can ask them in the chat. Each agent has their own specialty and knowledge about what's going on within the village and community." },
      { text: "There's also an AI community skill-sharing section. If you've used agents, you know that skill-sharing is really useful and a really awesome way to update and upgrade your agents. As a community, we could be building skills together for each of the agents to help us manage them and give them more ability to help us build our communities. As more villages enter the network, there could be skill-sharing that goes across all the different locations." },
    ],
  },
  {
    heading: "What hasn't gone well",
    paragraphs: [
      { text: "[Q: What hasn't gone well? What's gone wrong?]", aside: true },
      { text: "You can see a thousand things have been built here, and none of this even has anything to do with what we've built on the land." },
      { text: "As far as the land goes — year one, almost every machine broke down. We had multiple burst pipes. We had a heatwave that killed a huge amount of the beginning stages of the garden. We had a record snowfall that same year. Our tractors went down multiple times. We lost about six golf carts. Everything happened at once in one year. There are really no lessons to learn from it other than resilience. We just had to forge through it." },
      { text: "This is something I haven't mentioned a whole lot, but this is my piece of the culture. I'm looking at integrating tech so that people can be human again and not be overwhelmed with a giant mountain of tasks — because there is a lot with a project like this. I'm trying to use AI to lift the burden off the people who are actually participating, and I'm trying to help people become more resilient and learn meta-skills: learning how to learn, becoming more resilient physically, mentally, emotionally, using AI in a functional way." },
      { text: "We're missing a culture around proper use of technology, so I'm trying to teach my six-year-old and my two-year-old appropriate ways to use technology so they don't get caught up in dopamine addiction cycles. My mission is to help people be more resilient and more adapted for the future." },
    ],
  },
  {
    heading: "Protecting against AI risks",
    paragraphs: [
      { text: "[Q: Are there any areas you're having to protect against? In terms of people bonding through shared work, developing critical thinking, work ethic — anything to protect against, the equivalent of people talking about AI in school systems?]", aside: true },
      { text: "We've got two kids, so this is a critical area of focus. Our son is doing really well in his education, and I think that's because we treat public school kind of like social time, and we take the responsibility of doing the real education at home." },
      { text: "Euvie takes him out all the time onto the land, and she knows a lot about mushroom foraging, so Alex knows how to identify mushrooms and find ones that are edible. He's also learning about carpentry and 3D printing and laser cutting with me. He's learning more and more every year about land and machinery. He's also really into space, and we've given him a telescope, and we've got really clear skies, so he can do stargazing and learn about planets. He's getting a really balanced education when it comes to AI and technology and how to search for information and use technology in a safe and intentional way." },
      { text: "I'm super excited that Euvie's starting this forest-schooling program because I think it's going to give people in the surrounding area an opportunity to expose their kid to a new kind of environment and a new education system." },
      { text: "Zooming back out to AI: a lot of people are really afraid of AI. I see that a lot because I run an AI setup service and a Zoom call at designspore.co where I help business owners learn about it and incorporate it into their businesses. There's a really big opportunity here to help the local community incorporate AI, which will create faster and more efficient businesses, generate more revenue, and attract more young people to stay because there will be more innovation and opportunity." },
      { text: "I'm constantly having conversations with people about their fears about AI — everyone has fears about a Terminator situation or a Matrix situation, an overdependence, a loss of humanity. I'm a builder in AI, so I'm building things every day, and I get to see what's possible. That gives me a lot of optimism for the future." },
      { text: "What I'm shipping on a daily basis used to take me months, and I would only do one at a time. Now I'm shipping multiple things every day, and I get a chance to actually step back and be with my family — because once I've put all my agents to work, there's not really much more I can do to move the needle." },
      { text: "Doing computer-based work now just feels way less effective, way less efficient, more costly. I make more mistakes. I burn myself out. So rather than just doing everything myself and working to feel productive like I used to, I walk away. I go play the drums with my daughter. I go teach my son something or play video games with him, or I go walk on the land." },
      { text: "The cadence of my work schedule has vastly changed from only two months ago, which is amazing. Now I consider myself more of an agent orchestrator." },
      { text: "The second part of your question — people becoming overly reliant, dumber, less creative. I think the biggest risk of AI is actually the WALL-E scenario. People have destroyed the planet, they've left Earth, everyone's fat and consumes content 24/7. They don't know anything about what's going on in the world around them. They're just consumers. So that is a fairly real potential downside." },
      { text: "But AI for me has been a tool that has made me 100 times more productive and given me a healthier work/life balance. If other people start using it and more people produce things, I think the open-source movement is going to explode. For people who have the impulse to build and create and are internally driven, they're going to be more productive. And people who didn't want to do anything in the first place are going to be seeing everyone around them building these cool things, and I think they're going to be inspired too." },
    ],
  },
  {
    heading: "Goals & what's needed",
    paragraphs: [
      { text: "[Q: What are you needing? What are your goals right now? What's your top three focus?]", aside: true },
      { text: "Two things. First, membership is open now. Right now it's only the one location, but as we gain investment and start expanding the network of villages — and we don't actually have to buy individual pieces of land, we can bring existing campsites and resorts into the network — people can buy the membership now and come visit and enjoy some of the amenities at our first location." },
      { text: "Second, we need investment. We need to raise two stages: $3 million first in the next couple of months, to build the early stages of the maker space, do the feasibility study, get approvals, secure the land. That will leverage us into the next phase, which is $20 million and up. This is to build the larger vision of the property and the smart village. We're going to build the cabins and tiny homes, work on longer-term stays, add 50-amp services for the big park-model RVs and tiny homes. And then potentially, because land is so much cheaper in the south, we might even get the second property with that second phase of investment." },
      { text: "People can donate, they can invest in the future potential of all of these different projects. I think the tiny home builds are going to be really popular. And accommodation and glamping generate a decent amount of revenue. With what we've learned over the last several years, we're going to be able to really expand that. We have a background in storytelling and marketing, we have the podcast, we have all these media channels, and we're fairly well known online. The marketing side of this is going to be really strong." },
      { text: "We know all of our neighbors. We've gotten a lot of support from people in this project. Whenever we do a build project, we just throw it in the group chat and a whole bunch of our neighbors come in and help us build stuff. The community vision for this place expands much larger than our existing property — it really looks at the entire region." },
      { text: "The third goal is: we want to host a big festival. I would love to host Otherworld. We were trying to get a smaller version of it on the land this year, but it was just too much to get going. So we're looking at potentially next year. We do have a community already; people return every year." },
    ],
  },
  {
    heading: "Winter & seasonality",
    paragraphs: [
      { text: "[Q: How does it work in the winter? That's the big thing for me as a Canadian — there are much fewer people able and willing to do it through the winter.]", aside: true },
      { text: "This is one of the reasons I'm trying to work on policy change in the TNRD — because the way they treat tiny homes is basically the same way they treat RVs, even though tiny homes can be insulated and have proper plumbing and be set to code. It's really difficult to get those types of dwellings to be on the land during the winter." },
      { text: "That said, I really love the digital-nomad life, so I actually like the idea of just moving in the winter and going somewhere in the south. There's more opportunity to see new things and have novelty. So I've kind of enjoyed the fact that it shuts down." },
      { text: "We've been kind of limited because of the seasonality of our location and some of the policies with government. It's a bit of a stretch to be calling it a village, but the whole idea is about experimentation and prototyping so we can build the tools and the systems and the software that other people can use to start their own villages." },
      { text: "We're thinking about how the West is kind of collapsing and there's a need for projects like this, especially in the West. There's so much brain drain. People are leaving in droves. Investment is disappearing. People aren't really thinking in long-term timescales because nobody knows what's going to happen six months from now, never mind 30 years from now." },
      { text: "That's one of the reasons we decided to do this project in Canada. It's not easy because of the cost of living and the bureaucracy and the seasons, but we figured that if we could do it in Canada, it'd be a lot easier to scale it and do it in other locations. We're open April to November." },
    ],
  },
  {
    heading: "Work-stay & tiny homes",
    paragraphs: [
      { text: "[Q: I'd like to hear more about the work-stay program and where the tiny homes are right now.]", aside: true },
      { text: "We need a bigger maker space before we can do that. What I'd like to do, because the summers are so busy, is build a large barn where I can actually manufacture tiny homes and cabins indoors over the winter. We've had interest from prefab home and cabin manufacturers to partner with us on this project, so there's an opportunity there too." },
      { text: "I've been into a lot of digital manufacturing in the last few years. I've just been pumping out stuff with the 3D printer and the laser cutter, and I've learned a lot about CNC manufacturing. You can actually cut out cabins in the span of a day or two and then assemble them with Japanese-style click-together joinery in about a day with a small group of people. Over the span of a winter, we can get a lot done with a good maker space." },
      { text: "[Q: Would the work-stay program be involved in building that workspace?]", aside: true },
      { text: "Oh, for sure. But funding's the big hurdle right now. Once we have the funding, then everything starts moving. I know exactly where it would go, I know exactly what machines I would put in it. I have a shopping list ready to press Go on. We've just got to wait." },
    ],
  },
  {
    heading: "Snowbirds & a southern location",
    paragraphs: [
      { text: "[Cheryl: There are an awful lot of people with white hair in the North Thompson Valley, some of them no longer have children. That might be something you put into Claude and ask questions about.]", aside: true },
      { text: "There are a lot of snowbirds, too, with white hair who want to go back and forth but want to maintain their residency in Canada because of the medical system. My parents are among that category — they stay six months in Canada, and then they're in Mexico for the rest of the time. That actually works on both fronts for our project, because if we got a place in Colombia or somewhere in the south, then they'd be able to go back and forth between both locations." },
      { text: "I've been a digital nomad for many years. I was in Ecuador a few years ago. A friend of ours had purchased a resort that had 30 beautiful bungalows, swimming pools, a full restaurant and bar, a community center, a maker space, a dance studio, a permaculture garden — just a beautiful location. They spent $900,000 to buy that place. If people look outside of Mexico and pool funds together to buy something like that, I could get a handful of people who could have their entire winter sorted out and then have our location in the summer." },
      { text: "[Cheryl: That would be an easy sell, Mike. The added bonus is that it's within a community that is doing good things, so you have the sense that you're getting this lifestyle that allows you this comfort and this beautiful scenery, while knowing that your money's going towards something meaningful and building more resilient communities.]", aside: true },
      { text: "I think something like that for the tiny homes up north would work too. If I were to work to help build a tiny home, put some money into it, then it could be a place that could be rented out over the winter. We've had people buy RVs and just store them on the land the whole winter, and lots of people have told us that they'd be happy if we rented them out." },
    ],
  },
  {
    heading: "Software philosophy",
    paragraphs: [
      { text: "[Q: Do you picture licensing the access to the software for people doing the same thing elsewhere?]", aside: true },
      { text: "I think software-as-a-service is going to be dead inside of this year because it's just too easy to spin up software on your own. I just don't want to charge for stuff like that. I'd rather try to get a donation, because then I can just open-source everything. I don't have to build a business model around stuff that I don't believe should be sold anyway." },
      { text: "This kind of thing is going to save the West. I just don't want to put up barriers. It could be on a donation basis even." },
      { text: "We actually registered Future Thinkers as a foundation last year, so we're working on getting tax-deductible status, and it's really focused around education. This will be part of Euvie's forest-schooling program, but also a way for us to open-source the whole dashboard that I've been building." },
    ],
  },
  {
    heading: "AI, robots, and the future",
    paragraphs: [
      { text: "[Mark: On the podcast we've talked about basic income. I don't think that's the solution to everything, and I don't know how it gets funded, but I do know that robots are a lot closer than most people think.]", aside: true },
      { text: "AI is already incredible, and humans are reaching the limit of what they are cognitively capable of delegating to AI. It's not the AI's limitation, it's human limitation. AI in the background is still getting better and better." },
      { text: "There was a model just released by Anthropic a few weeks ago, and they found that it was too good — they couldn't release it to the public yet because it had found something like 100 hacking exploits in modern operating systems like Linux and Windows. There's this thing called a zero-day exploit, meaning it's never been used. They found a 30-year-old zero-day exploit in some operating system that's never been uncovered. These are like lit backdoors that no human has ever discovered before. The AI found hundreds of them across Microsoft, major corporations. Anthropic decided to release this AI early to the large companies to use the AI to patch up all the holes, and then they're going to release it to the public." },
      { text: "I was talking about this with Euvie because she doesn't use AI as much as I do, and she was like, \"Oh my God, how can they give people access to this? It's too powerful.\" And I said, Claude's already insanely powerful. The latest model, Opus 4.7, is far more powerful than most people even realize and know how to use." },
      { text: "Robots are going to be here very, very soon. They've got robots folding laundry and doing jujitsu, doing backflips, serving coffees. They're getting more and more agile and dexterous and strong. The only thing limiting them from being widely distributed everywhere is manufacturing scale-up and the cost per unit, and the cost is going to shrink. You can already get a fairly decent robot for about 25 grand. When that gets to about four grand, you don't think everyone's going to own one? I imagine having a fleet of these robots building houses. Goodbye housing crisis all of a sudden." },
      { text: "We've been doing this podcast for 10 years and took a break after we had kids and started this project. But we've sort of seen the writing on the wall when it comes to technology and where AI is headed and where society will head inevitably as AI gets more capable and starts taking over jobs." },
      { text: "I've been trying to steer things and be prepared to take advantage of some of these trends. So buying this land was a strategic move. I've seen a lot of projects like this fail due to a lack of professionalism, a lack of labor, a lack of good conflict mediation, a lack of funding. But I figured hopefully by the time we were ready to bring a lot more people in and expand and grow this project, AI and robots would be at a level where we could actually get a lot of help and mitigate some of those problems of purely human-run communities." },
      { text: "I also thought that communities would eventually become popular as jobs started disappearing and people wanted to be closer to the land and be self-sufficient. So I've been seeing this multiplicative, multipolar set of variables that are all pushing in the same direction. As AI and robots start taking over more jobs, they also create this opportunity for community and land projects to be cheaper and more efficient and more effectively run, thereby allowing people to actually be in community and be more human." },
      { text: "For the first time, we've started to see this opportunity for scaling a network of villages, for bringing it across the world, because in a short amount of time, most of the variables that made communities fail are going to be handled and assisted by robots and AI." },
      { text: "[Cheryl: It's not talked about enough. People are just unaware of what's down the road.]", aside: true },
      { text: "When that does happen, it doesn't mean that human relationship and human contact and human experience is going to be worth less. In fact, it'll be worth more." },
      { text: "[Cheryl: Countries are now thinking about how they deal with that because already major corporations are laying off 40% of their employees this year because of AI. Entire divisions are going away. These AI CEOs and politicians are claiming that this is like the Industrial Revolution where one sector of jobs went away and another sector opened up. No. That's not going to happen. This is a shutdown of employment, and people need to realize that.]", aside: true },
      { text: "Some governments do realize it, and there's a lot of discussion about basic income. One thing I know to be true is that most people out there, if you ask them what they would do if their cost of living was zero, they say they would do community projects, they would build things, they would learn a skill, they would learn something that is useful to their community. A lot of people are looking at career paths in terms of, will it make enough money for me to live? Maybe more people would do things for a purpose, or create things to help their community." },
      { text: "AI job loss is not necessarily going to be a bad thing if there's a way that people can have their basic needs met. We're going to see an explosion of creativity and building, especially with those people using AI to build things with them. I have a lot of hope about the future. I just think the transition into a post-job economy is going to be ugly, but I think once we're past it, it'll look pretty good." },
    ],
  },
  {
    heading: "The currency of experience",
    paragraphs: [
      { text: "[Mark: I have this sense that there's a new currency developing — the currency of experience. We're paying money for experience, but we don't look at it as that. The current system has us valuing certain things over other things. All the relational things you guys were talking about have a high value, but the algorithms and aggregators and systems set up are meant to devalue that and make you value other things more. As people experience these things — festivals and get-togethers — they will realize the value. \"I would pay money for this. I'd give up time for this,\" because it stays with you. That's one of the things that places like this and groups like this are giving us — a chance to just reacquaint ourselves with those values.]", aside: true },
    ],
  },
  {
    heading: "Events coming up",
    paragraphs: [
      { text: "Euvie's got a whole bunch of stuff planned for the summer. She's going to be hosting homeschooling packages for locals so they can come up, drop their kids off, get some alternative education, then the parents can relax and go for a hike, or hang out in the sauna." },
      { text: "We're also going to try to host build workshops because we've had some structures collapse in the last winter, and we need to build lean-tos. We're hoping to build more cabins and that kind of stuff. There's a lot of opportunity for people to learn how to work with their hands and build things with us. We'll probably have a calendar of all the events, with a weekly cadence for the weekend forest-schooling thing that Euvie's doing. And we'll do monthly work-stay programs where people can actually as a team build stuff together." },
      { text: "At the end of the season, we want to do a big party on the land. It'd be really nice to get like 100 or 200 people out there and have a huge party and do some work with art and sculptures and just really creative stuff. It would be super fun." },
      { text: "By the way, all of this stuff that I've covered in this call today is hosted at Portal.Place, so you can get all that information there." },
    ],
  },
  {
    heading: "Closing",
    paragraphs: [
      { text: "That's it for this call. I felt like we explored a lot of the areas of our project that I haven't talked about before, and I'm really glad that the people who showed up to the call contributed — it would've been a lot harder to go over all these subjects without them." },
      { text: "We're entering phase two of the next round of fundraising. We're looking to raise $3 million through a combination of donation and investment, and we're moving into phase three after that, which is building out the larger vision of the project and expanding the network." },
      { text: "If you want to check out the membership, you can go to Portal.Place. If you want to just camp here on the land, you can go to wellsgrayresort.ca. If you want to check out the podcasts and all of our previous conversations about community design and the future and artificial intelligence, you can go to FutureThinkers.org. And if you're interested in learning more about artificial intelligence and how it can improve your business processes and make you more money, you can go to designspore.co." },
      { text: "We'd really appreciate people who've made it all the way through this video sharing it with people who they think would be interested in joining the project in any form — work-stay, membership, investment, partnership, anything like that. This is going to succeed from a grassroots, bottom-up kind of movement, and any help you can give us, even in terms of just sharing it around, will really be helpful." },
      { text: "Finally, if you want to check out the place and learn about the project, you should come to the party that we're going to host at the end of the season. We don't have a date specified yet, but that's coming up soon. Check Portal.Place for any calendar events and sign up, and you'll get notified." },
      { text: "If you want to join one of these calls in the future, you can check that out at Portal.Place/calls." },
    ],
  },
];
