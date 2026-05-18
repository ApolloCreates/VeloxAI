from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def generate_pdf(content: str, filename: str):
    doc = SimpleDocTemplate(filename)
    styles = getSampleStyleSheet()

    elements = []

    lines = content.split("\n")

    for line in lines:
        line = line.strip()

        if not line:
            elements.append(Spacer(1, 10))
            continue

        # 🔥 Headings
        if line.endswith(":"):
            elements.append(Paragraph(f"<b>{line}</b>", styles["Heading3"]))

        # 🔥 Bullet points
        elif line.startswith("-"):
            elements.append(Paragraph(f"• {line[1:].strip()}", styles["Normal"]))

        else:
            elements.append(Paragraph(line, styles["Normal"]))

        elements.append(Spacer(1, 8))

    doc.build(elements)

    return filename