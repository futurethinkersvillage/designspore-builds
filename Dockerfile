# MaskGen service (maskgen/serve.py) — engine + AI endpoints.
FROM python:3.12-slim
WORKDIR /srv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY engine/ engine/
COPY maskgen/serve.py maskgen/serve.py
COPY maskgen/app/ maskgen/app/
ENV PORT=8710
EXPOSE 8710
CMD ["python", "maskgen/serve.py"]
