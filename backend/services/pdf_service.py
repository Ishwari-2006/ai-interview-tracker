from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io
from datetime import datetime

def generate_report(user_data: dict, stats: dict, interviews: list, questions: list) -> bytes:
    """
    Generate a PDF report and return it as bytes.
    
    We use a buffer (io.BytesIO) instead of saving to disk —
    this means the PDF is created in memory and sent directly
    to the user without saving any file on the server.
    """
    buffer = io.BytesIO()
    
    # Create the PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    # Colors we'll use throughout
    DARK_BLUE = colors.HexColor('#1e40af')
    LIGHT_BLUE = colors.HexColor('#3b82f6')
    DARK_BG = colors.HexColor('#1e293b')
    GRAY = colors.HexColor('#6b7280')
    LIGHT_GRAY = colors.HexColor('#f1f5f9')
    GREEN = colors.HexColor('#22c55e')
    RED = colors.HexColor('#ef4444')
    WHITE = colors.white

    # Define text styles
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        textColor=WHITE,
        alignment=TA_CENTER,
        spaceAfter=6,
        fontName='Helvetica-Bold'
    )

    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#94a3b8'),
        alignment=TA_CENTER,
        spaceAfter=4,
    )

    section_header_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading1'],
        fontSize=14,
        textColor=DARK_BLUE,
        spaceBefore=16,
        spaceAfter=8,
        fontName='Helvetica-Bold'
    )

    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#374151'),
        spaceAfter=4,
    )

    small_style = ParagraphStyle(
        'Small',
        parent=styles['Normal'],
        fontSize=8,
        textColor=GRAY,
    )

    # This list holds all elements we'll add to the PDF
    elements = []

    # ── HEADER BANNER ──
    # We use a Table with colored background as a banner
    header_data = [[
        Paragraph("AI Interview Tracker", title_style),
    ]]
    header_table = Table(header_data, colWidths=[515])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DARK_BG),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
        ('TOPPADDING', (0, 0), (-1, -1), 20),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 20),
        ('LEFTPADDING', (0, 0), (-1, -1), 20),
        ('RIGHTPADDING', (0, 0), (-1, -1), 20),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 6))

    # Subtitle with user name and date
    elements.append(Paragraph(
        f"Interview Progress Report — {user_data.get('name', 'User')}",
        subtitle_style
    ))
    elements.append(Paragraph(
        f"Generated on {datetime.now().strftime('%d %B %Y')}",
        subtitle_style
    ))
    elements.append(Spacer(1, 20))

    # ── STATS CARDS ROW ──
    elements.append(Paragraph("📊 Performance Overview", section_header_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_BLUE, spaceAfter=12))

    # 4 stat boxes in a row using a Table
    pass_color = GREEN if stats.get('pass_rate', 0) >= 50 else RED
    stats_data = [[
        Paragraph(f"<b>{stats.get('total_interviews', 0)}</b><br/><font size=8 color='gray'>Total Interviews</font>", normal_style),
        Paragraph(f"<b>{stats.get('pass_rate', 0)}%</b><br/><font size=8 color='gray'>Pass Rate</font>", normal_style),
        Paragraph(f"<b>{stats.get('total_questions', 0)}</b><br/><font size=8 color='gray'>Questions Logged</font>", normal_style),
        Paragraph(f"<b>{stats.get('stuck_questions', 0)}</b><br/><font size=8 color='gray'>Stuck Questions</font>", normal_style),
    ]]
    stats_table = Table(stats_data, colWidths=[128, 128, 128, 128])
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GRAY),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('FONTSIZE', (0, 0), (-1, -1), 16),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
    ]))
    elements.append(stats_table)
    elements.append(Spacer(1, 20))

    # ── INTERVIEW HISTORY TABLE ──
    if interviews:
        elements.append(Paragraph("📋 Interview History", section_header_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_BLUE, spaceAfter=12))

        # Table headers
        table_data = [[
            Paragraph('<b>Company</b>', normal_style),
            Paragraph('<b>Role</b>', normal_style),
            Paragraph('<b>Round</b>', normal_style),
            Paragraph('<b>Outcome</b>', normal_style),
            Paragraph('<b>Difficulty</b>', normal_style),
        ]]

        # Table rows
        for interview in interviews:
            outcome = interview.get('outcome', 'Pending')
            outcome_color = '#22c55e' if outcome == 'Pass' else '#ef4444' if outcome == 'Fail' else '#f59e0b'
            
            table_data.append([
                Paragraph(interview.get('company_name', '—'), normal_style),
                Paragraph(interview.get('role') or '—', small_style),
                Paragraph(interview.get('round_type') or '—', small_style),
                Paragraph(f'<font color="{outcome_color}"><b>{outcome}</b></font>', normal_style),
                Paragraph(interview.get('difficulty') or '—', small_style),
            ])

        interview_table = Table(table_data, colWidths=[120, 110, 90, 90, 90])
        interview_table.setStyle(TableStyle([
            # Header row styling
            ('BACKGROUND', (0, 0), (-1, 0), DARK_BG),
            ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            # Alternating row colors
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(interview_table)
        elements.append(Spacer(1, 20))

    # ── WEAK AREAS ──
    stuck_topics = stats.get('stuck_by_topic', [])
    stuck_topics = [t for t in stuck_topics if t.get('topic')]
    
    if stuck_topics:
        elements.append(Paragraph("🎯 Weak Areas (Topics to Focus On)", section_header_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=RED, spaceAfter=12))

        weak_data = [['Topic', 'Times Stuck']]
        for topic in sorted(stuck_topics, key=lambda x: x['count'], reverse=True):
            weak_data.append([
                Paragraph(topic['topic'], normal_style),
                Paragraph(f"<font color='#ef4444'><b>{topic['count']}</b></font>", normal_style),
            ])

        weak_table = Table(weak_data, colWidths=[350, 150])
        weak_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#fef2f2')),
            ('TEXTCOLOR', (0, 0), (-1, 0), RED),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, colors.HexColor('#fff5f5')]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#fecaca')),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ]))
        elements.append(weak_table)
        elements.append(Spacer(1, 20))

    # ── QUESTION BANK ──
    if questions:
        elements.append(Paragraph("❓ Question Bank", section_header_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_BLUE, spaceAfter=12))

        for idx, q in enumerate(questions[:30]):  # limit to 30 questions
            # Question number + text
            stuck_label = " 🔴" if q.get('was_stuck') else ""
            topic_label = f" [{q['topic_tag']}]" if q.get('topic_tag') else ""
            
            elements.append(Paragraph(
                f"<b>{idx + 1}.</b> {q['question_text']}{stuck_label}",
                normal_style
            ))
            if topic_label:
                elements.append(Paragraph(
                    f"<font size=8 color='gray'>Topic: {q['topic_tag']}</font>",
                    small_style
                ))
            elements.append(Spacer(1, 4))

    # ── FOOTER ──
    elements.append(Spacer(1, 20))
    elements.append(HRFlowable(width="100%", thickness=1, color=LIGHT_GRAY))
    elements.append(Spacer(1, 8))
    elements.append(Paragraph(
        "Generated by AI Interview Tracker • Keep preparing, keep growing! 💪",
        ParagraphStyle('Footer', parent=styles['Normal'], fontSize=8, textColor=GRAY, alignment=TA_CENTER)
    ))

    # Build the PDF
    doc.build(elements)

    # Get the PDF bytes from the buffer
    buffer.seek(0)
    return buffer.read()