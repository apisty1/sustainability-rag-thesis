import os
import json
import re
from pypdf import PdfReader
from dotenv import load_dotenv
import weaviate
from weaviate.classes.config import Configure, Property, DataType

# -------------------------------------------------
# ENV
# -------------------------------------------------
load_dotenv()

WEAVIATE_URL = os.getenv("WEAVIATE_URL")
WEAVIATE_API_KEY = os.getenv("WEAVIATE_API_KEY")
OPENAI_APIKEY = os.getenv("OPENAI_APIKEY")

PDF_PATH = "ferrero-group-2024-sustainability-report.pdf"
KPI_JSON = "ferrero_environment_kpis.gold.json"

# -------------------------------------------------
# CONNECT
# -------------------------------------------------
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=WEAVIATE_URL,
    auth_credentials=weaviate.auth.AuthApiKey(WEAVIATE_API_KEY),
    headers={
        "X-OpenAI-Api-Key": OPENAI_APIKEY
    }
)

print("✓ Connected to Weaviate")

# -------------------------------------------------
# DROP COLLECTIONS
# -------------------------------------------------
def drop_if_exists(name):
    if name in client.collections.list_all():
        client.collections.delete(name)
        print(f"✓ Dropped {name}")

drop_if_exists("FerreroKPI")
drop_if_exists("FerreroNarrative")
# -------------------------------------------------
# CREATE FerreroKPI
# -------------------------------------------------
client.collections.create(
    name="FerreroKPI",
    description="Structured environmental KPIs from Ferrero Sustainability Report 2024",
    vectorizer_config=Configure.Vectorizer.text2vec_openai(),
    properties=[
        Property(name="category", data_type=DataType.TEXT),
        Property(name="metric", data_type=DataType.TEXT),
        Property(name="unit", data_type=DataType.TEXT),
        Property(name="year", data_type=DataType.TEXT),
        Property(name="value", data_type=DataType.NUMBER),
        Property(name="notes", data_type=DataType.TEXT),
        Property(name="source", data_type=DataType.TEXT),
    ],
)

print("✓ Created FerreroKPI")

# -------------------------------------------------
# CREATE FerreroNarrative (textual context)
# -------------------------------------------------
client.collections.create(
    name="FerreroNarrative",
    description="Narrative sections of Ferrero Sustainability Report 2024",
    vectorizer_config=Configure.Vectorizer.text2vec_openai(),
    properties=[
        Property(name="page", data_type=DataType.INT),
        Property(name="section", data_type=DataType.TEXT),
        Property(name="text", data_type=DataType.TEXT),
    ],
)

print("✓ Created FerreroNarrative")

kpi_coll = client.collections.get("FerreroKPI")
text_coll = client.collections.get("FerreroNarrative")

# -------------------------------------------------
# INGEST KPI JSON (1 record = 1 year)
# -------------------------------------------------
with open(KPI_JSON) as f:
    data = json.load(f)

for kpi in data["kpis"]:
    for year, value in kpi["values"].items():
        kpi_coll.data.insert({
            "category": kpi["category"],
            "metric": kpi["metric"],
            "unit": kpi["unit"],
            "year": year,
            "value": value,
            "notes": kpi.get("notes", ""),
            "source": "Ferrero Sustainability Report 2024"
        })

print("✓ Inserted KPI data")

# -------------------------------------------------
# CLEAN TEXT
# -------------------------------------------------
def clean_text(text):
    text = text.replace("\n", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()

# -------------------------------------------------
# INGEST NARRATIVE TEXT
# -------------------------------------------------
reader = PdfReader(PDF_PATH)

for i, page in enumerate(reader.pages):
    page_num = i + 1

    # Skip KPI tables pages
    if 93 <= page_num <= 121:
        continue

    try:
        text = page.extract_text()
    except:
        text = ""

    if not text or len(text) < 200:
        continue

    text_coll.data.insert({
        "page": page_num,
        "section": "Narrative",
        "text": clean_text(text)
    })

print("✓ Inserted narrative text")

client.close()
print("\n🚀 Ingest completed successfully!")