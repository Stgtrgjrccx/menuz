import os
import sys
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.pdfgen import canvas

SLIDE_WIDTH = 13.333 * 72   # 960 pt
SLIDE_HEIGHT = 7.5 * 72     # 540 pt

def draw_decorations(c, doc):
    c.saveState()
    # Dark Midnight Obsidian Background
    c.setFillColor(colors.HexColor("#0A0D14"))
    c.rect(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT, fill=1, stroke=0)

    # Footer line
    c.setStrokeColor(colors.HexColor("#243044"))
    c.setLineWidth(1)
    c.line(50, 28, SLIDE_WIDTH - 50, 28)

    # Footer Branding & Page Count
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(colors.HexColor("#F59E0B"))
    c.drawString(50, 16, "MENUZ")
    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#94A3B8"))
    c.drawString(98, 16, "|   Executive Validation Pitch Deck • 5-7 Min Operator Review")
    
    slide_text = f"Slide {doc.page} of 6"
    c.drawRightString(SLIDE_WIDTH - 50, 16, slide_text)
    c.restoreState()

def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=(SLIDE_WIDTH, SLIDE_HEIGHT),
        leftMargin=50,
        rightMargin=50,
        topMargin=26,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    c_gold = colors.HexColor("#F59E0B")
    c_terra = colors.HexColor("#FF5722")
    c_cyan = colors.HexColor("#06B6D4")
    c_emerald = colors.HexColor("#10B981")
    c_card_bg = colors.HexColor("#121824")
    c_card_alt = colors.HexColor("#182234")
    c_card_high = colors.HexColor("#1E293B")
    c_border = colors.HexColor("#243044")
    c_border_gold = colors.HexColor("#D97706")
    c_border_cyan = colors.HexColor("#0891B2")
    c_text_white = colors.HexColor("#FAFAFA")
    c_text_ice = colors.HexColor("#CBD5E1")
    c_text_muted = colors.HexColor("#94A3B8")

    def make_style(name, font='Helvetica', size=11, leading=14, color=c_text_white, bold=False, italic=False):
        fontName = 'Helvetica-Bold' if bold else ('Helvetica-Oblique' if italic else font)
        return ParagraphStyle(name, parent=styles['Normal'], fontName=fontName, fontSize=size, leading=leading, textColor=color)

    st_tag_terra = make_style('TagT', size=11, leading=14, color=c_terra, bold=True)
    st_tag_cyan = make_style('TagC', size=11, leading=14, color=c_cyan, bold=True)
    st_tag_gold = make_style('TagG', size=11, leading=14, color=c_gold, bold=True)
    st_tag_eme = make_style('TagE', size=11, leading=14, color=c_emerald, bold=True)

    st_title = ParagraphStyle('Title', parent=styles['Normal'], fontName='Times-Bold', fontSize=22, leading=26, textColor=c_text_white)
    st_card_header = make_style('CardH', size=11, leading=14, bold=True)
    st_item_title = make_style('ItemT', size=11, leading=14, color=c_text_white, bold=True)
    st_item_desc = make_style('ItemD', size=9.5, leading=13, color=c_text_ice)
    st_item_muted = make_style('ItemM', size=9.5, leading=13, color=c_text_muted)
    
    st_q_tag = make_style('QTag', size=9, leading=11, color=c_gold, bold=True)
    st_q_text = ParagraphStyle('QText', parent=styles['Normal'], fontName='Times-Italic', fontSize=10.5, leading=13.5, textColor=c_text_white)

    story = []

    def make_q_table(q_text, role):
        p_tag = Paragraph(f"✦ CRITICAL PRE-DEVELOPMENT VALIDATION QUESTION ({role}):", st_q_tag)
        p_val = Paragraph(f'"{q_text}"', st_q_text)
        t = Table([[p_tag], [p_val]], colWidths=[860])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_card_high),
            ('BOX', (0,0), (-1,-1), 1, c_border_gold),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ]))
        return t

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 1: PROBLEM / TIME = MONEY
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("// INDUSTRY REALITY // TABLE VELOCITY", st_tag_terra))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Your food is crafted with art. Why is your menu just plain text?", st_title))
    story.append(Spacer(1, 10))

    left_cells = [
        [Paragraph("THE 15-MINUTE RUSH-HOUR BOTTLENECK", ParagraphStyle('H1', parent=st_card_header, textColor=c_terra))],
        [Spacer(1, 4)],
        [Paragraph("• 0 to 5 Min // Menu Wait", st_item_title)],
        [Paragraph("Guests are seated during peak rush and wait 5 minutes for busy servers to deliver greasy, worn paper menus.", st_item_muted)],
        [Spacer(1, 6)],
        [Paragraph("• 5 to 10 Min // Deciding Blindly", st_item_title)],
        [Paragraph("Flipping through plain text descriptions with zero photos, guessing portion sizes, spice levels, and ingredients.", st_item_muted)],
        [Spacer(1, 6)],
        [Paragraph("• 10 to 15 Min // Calling Order Takers", st_item_title)],
        [Paragraph("Waving hands to catch an order taker's eye just to get the order manually scribbled into a paper pad.", st_item_muted)],
    ]
    t_left = Table(left_cells, colWidths=[415])
    t_left.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    right_cells = [
        [Paragraph("THE WEAR & TEAR + UNCLAIMED CAPACITY", ParagraphStyle('H2', parent=st_card_header, textColor=c_gold))],
        [Spacer(1, 4)],
        [Paragraph("✦ Paper Menus Bleed Image & Margin", st_item_title)],
        [Paragraph("Faded laminates, taped price changes, and worn edges cost ₹15,000–₹25,000 every seasonal reprint—while failing completely to showcase the chef's culinary plating art.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ The Mathematical Reality (Time = Money)", st_item_title)],
        [Paragraph("15 minutes wasted per table &times; 30 dining tables during a 2.5-hour weekend peak = <b>7.5 hours of dead dining capacity lost every evening</b>.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ The Revenue Opportunity", st_item_title)],
        [Paragraph("Eliminating this 15-minute ordering lag unlocks 1 additional table turnover per rush—worth <b>₹30,000 to ₹50,000 in uncaptured gross margin every weekend</b>.", st_item_desc)],
    ]
    t_right = Table(right_cells, colWidths=[430])
    t_right.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_alt),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    t_split = Table([[t_left, t_right]], colWidths=[425, 435])
    t_split.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_split)
    story.append(Spacer(1, 10))
    story.append(make_q_table("Hypothetically, if your floor could eliminate that 15-minute ordering lag across every table during rush hours, how many more guests could you comfortably seat—and how much money is currently being left on the table?", "RESTAURANT OWNER & GENERAL MANAGER"))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 2: SCAN & VIEW
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("// STEP 01 // FRICTIONLESS ADOPTION", st_tag_cyan))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Point. Scan. Feast. Zero Apps, Zero Waiting.", st_title))
    story.append(Spacer(1, 10))

    s2_left = [
        [Paragraph("THE ZERO-APP SEAMLESS JOURNEY", ParagraphStyle('H21', parent=st_card_header, textColor=c_cyan))],
        [Spacer(1, 4)],
        [Paragraph("01 // Custom Tableside QR Standee", st_item_title)],
        [Paragraph("Diner sits down & sees a weighted, dark luxury acrylic/wooden standee with an etched table QR code.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("02 // Native Camera Scan (0 Sec Wait)", st_item_title)],
        [Paragraph("No app download. No OTP. Native iOS Camera or Android Chrome opens the live menu in 0.8 seconds.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("03 // Visual Culinary Showroom Wall", st_item_title)],
        [Paragraph("Dishes appear in square high-definition frames on illuminated glass shelves with authentic textures & prices.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("04 // Instant Dietary & Spice Clarity", st_item_title)],
        [Paragraph("Diners instantly view heat scales (1–5 flame meters), veg badges, portion sizes, and allergens.", st_item_muted)],
    ]
    t_s2_l = Table(s2_left, colWidths=[415])
    t_s2_l.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border_cyan),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    s2_right = [
        [Paragraph("WHY DINERS EAT WITH THEIR EYES", ParagraphStyle('H22', parent=st_card_header, textColor=c_gold))],
        [Spacer(1, 4)],
        [Paragraph("✦ Eliminates Ordering Indecision", st_item_title)],
        [Paragraph("When guests see high-resolution dish plating, they decide what they want in under 2 minutes instead of 8 minutes of paper browsing.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ Authentic Kitchen Representation", st_item_title)],
        [Paragraph("No stock photography. Shows the exact portion, garnish, and plating crafted by your head chef—eliminating diner disappointment.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ Real-Time Chef Agility in 3 Seconds", st_item_title)],
        [Paragraph("Sold out of the chef's special fish? Head Chef taps 'Sold Out' on their phone & the item disappears instantly across all 40 table QR codes. No awkward waiter apologies.", st_item_desc)],
    ]
    t_s2_r = Table(s2_right, colWidths=[430])
    t_s2_r.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_alt),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    t_s2 = Table([[t_s2_l, t_s2_r]], colWidths=[425, 435])
    t_s2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
    story.append(t_s2)
    story.append(Spacer(1, 10))
    story.append(make_q_table("When diners can see your exact plating, colors, and portion sizes before ordering, how much faster do they make up their minds?", "HEAD CHEF & RESTAURANT MANAGER"))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 3: MENUZ ORDER (EMPOWERING ORDER TAKERS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("// STEP 02 // EFFORTLESS FLOOR OPERATIONS", st_tag_eme))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Direct Tableside Orders. Built to Make Your Order Takers' Job Effortless.", st_title))
    story.append(Spacer(1, 10))

    s3_left = [
        [Paragraph("HOW MENUZ ORDER WORKS ON YOUR FLOOR", ParagraphStyle('H31', parent=st_card_header, textColor=c_emerald))],
        [Spacer(1, 4)],
        [Paragraph("Diner Builds Table Tray", st_item_title)],
        [Paragraph("Guests browse dishes, select preparation specifications (Less Spicy, Extra Chutney, Jain), and review totals.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("Multiplayer Real-Time Sync", st_item_title)],
        [Paragraph("4 diners at the same table add dishes to the same shared live cart simultaneously from their own phones.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("Direct POS & Thermal KOT Bridge", st_item_title)],
        [Paragraph("Orders route directly into your existing POS system and thermal kitchen ESC/POS printers with table number & time.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("Instant Kitchen Dispatch", st_item_title)],
        [Paragraph("Kitchen starts prep immediately while order takers remain on the floor attending to guest hospitality.", st_item_muted)],
    ]
    t_s3_l = Table(s3_left, colWidths=[415])
    t_s3_l.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    s3_right = [
        [Paragraph("EMPOWERING ORDER TAKERS, NOT REPLACING THEM", ParagraphStyle('H32', parent=st_card_header, textColor=c_gold))],
        [Spacer(1, 4)],
        [Paragraph("✦ Removes the Scribing Burden", st_item_title)],
        [Paragraph("Order takers stop acting as human notepads running back and forth with pen and paper. Their job becomes effortless, fast, and organized.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ Manage Twice the Tables with Zero Stress", st_item_title)],
        [Paragraph("During Saturday peak rush, a single server comfortably handles 8–10 tables instead of 4, because order entry is completely autonomous.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ Zero KOT Handwriting Mistakes", st_item_title)],
        [Paragraph("No misheard dishes, no forgotten dietary notes, and no kitchen disputes over scribbled tickets.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ 12 to 15 Minutes Reclaimed Every Table", st_item_title)],
        [Paragraph("Guests get food faster, finish dining without unnecessary delays, and leave delighted—multiplying total floor revenue.", st_item_desc)],
    ]
    t_s3_r = Table(s3_right, colWidths=[430])
    t_s3_r.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_alt),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    t_s3 = Table([[t_s3_l, t_s3_r]], colWidths=[425, 435])
    t_s3.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
    story.append(t_s3)
    story.append(Spacer(1, 10))
    story.append(make_q_table("On a packed Saturday night, how much smoother would your floor run if your order takers didn't have to sprint back and forth just to punch initial orders into the system?", "GENERAL MANAGER & RESTAURANT OWNER"))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 4: WIN CHALLENGE & 5-STAR GOOGLE REVIEWS
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("// STEP 03 // VIRAL REPUTATION HOOK", st_tag_gold))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Gamified Table Rewards. 50+ Verified 5-Star Google Reviews Every Week.", st_title))
    story.append(Spacer(1, 10))

    s4_left = [
        [Paragraph("THE 4-STEP REPUTATION MULTIPLIER", ParagraphStyle('H41', parent=st_card_header, textColor=c_gold))],
        [Spacer(1, 4)],
        [Paragraph("01 // The Tableside Win Toggle", st_item_title)],
        [Paragraph("While browsing the visual menu, diners see a subtle 'Win Table Rewards' badge inviting them to spin for a reward.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("02 // Smart Keyword Review Builder", st_item_title)],
        [Paragraph("Diners tap 3 prompt chips ('Crispy Paneer', 'Great Ambience', 'Lightning Fast'). Menuz instantly crafts a high-SEO authentic review.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("03 // 1-Tap Copy & Paste to Google", st_item_title)],
        [Paragraph("Diner copies with 1 tap, opens Google Maps in 1 tap, and pastes their glowing 5-star review in under 10 seconds.", st_item_muted)],
        [Spacer(1, 5)],
        [Paragraph("04 // Spin Wheel Unlocks Instantly", st_item_title)],
        [Paragraph("Once review is verified, the gamified wheel unlocks with a live spin animation to award their table reward!", st_item_muted)],
    ]
    t_s4_l = Table(s4_left, colWidths=[415])
    t_s4_l.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border_gold),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    s4_right = [
        [Paragraph("100% OWNER CONTROL & LOCAL SEARCH DOMINANCE", ParagraphStyle('H42', parent=st_card_header, textColor=c_cyan))],
        [Spacer(1, 4)],
        [Paragraph("✦ Completely Owner-Customizable Rewards", st_item_title)],
        [Paragraph("What diners win is 100% up to you: Free Welcome Mocktail, Chef's Signature Dessert, Free Appetizer, or 10% Off Next Visit. Cap daily voucher limits with 1 click.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ Totally Optional, Yet the #1 Guest Hook", st_item_title)],
        [Paragraph("Diners don't feel pressured—they feel rewarded. Turning wait time into a fun table game drives unprecedented 80%+ review participation.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ Permanent Google Maps Top-3 Ranking", st_item_title)],
        [Paragraph("Generating 30–50 verified local reviews every week pushes your restaurant to the #1 spot on Google Search & Maps for local dining queries.", st_item_desc)],
    ]
    t_s4_r = Table(s4_right, colWidths=[430])
    t_s4_r.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_alt),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    t_s4 = Table([[t_s4_l, t_s4_r]], colWidths=[425, 435])
    t_s4.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
    story.append(t_s4)
    story.append(Spacer(1, 10))
    story.append(make_q_table("If every table had a fun, 30-second reason to leave you a glowing Google review before paying the bill, what would that do for your weekend footfall?", "RESTAURANT OWNER & MARKETING HEAD"))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 5: MENUZ CONCIERGE (POWERED BY सारा AI)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("// STEP 04 // CULINARY INTELLIGENCE", st_tag_gold))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Menuz Concierge: Powered by सारा AI. Trained by the Head Chef & Owner.", st_title))
    story.append(Spacer(1, 10))

    s5_left = [
        [Paragraph("LIVE CONVERSATION WITH सारा AI", ParagraphStyle('H51', parent=st_card_header, textColor=c_gold))],
        [Spacer(1, 4)],
        [Paragraph("DINER (Table 4):", ParagraphStyle('DLabel', parent=st_item_title, fontSize=9, textColor=c_text_ice))],
        [Paragraph('"We have kids with us—is the Murgh Biryani too spicy, and what side pairs best with it?"', ParagraphStyle('DText', parent=st_item_desc, fontName='Times-Italic', textColor=c_text_white))],
        [Spacer(1, 5)],
        [Paragraph("सारा AI (Trained on Chef's Kitchen Lore):", ParagraphStyle('ALabel', parent=st_item_title, fontSize=9, textColor=c_gold))],
        [Paragraph('"Chef Ranveer prepares the Murgh Biryani with slow-cooked Awadhi dum. It has a rich aroma but mild heat (2/5), perfect for families! I recommend pairing it with our Smoked Saffron Raita (₹180)."', ParagraphStyle('AText', parent=st_item_desc, fontName='Times-Italic', textColor=c_text_ice))],
        [Spacer(1, 5)],
        [Paragraph("▶ [ + Add to Table Tray • ₹180 ] (1-Tap Direct Add)", ParagraphStyle('Btn', parent=st_item_title, textColor=c_emerald))],
        [Spacer(1, 4)],
        [Paragraph("<b>SECURITY GUARANTEE:</b> Items can be added directly to the cart from सारा AI, but orders can NEVER be placed directly from chat—preventing accidental orders.", ParagraphStyle('Sec', parent=st_item_muted, fontSize=8.5, leading=11))],
    ]
    t_s5_l = Table(s5_left, colWidths=[415])
    t_s5_l.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border_gold),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    s5_right = [
        [Paragraph("LIKE TALKING DIRECTLY TO THE HEAD CHEF & OWNER", ParagraphStyle('H52', parent=st_card_header, textColor=c_cyan))],
        [Spacer(1, 4)],
        [Paragraph("✦ Custom-Trained on Your Menu Only", st_item_title)],
        [Paragraph("Not an open-ended generic bot. सारा AI is strictly grounded in your recipes, ingredients, allergen profiles, and story. It never hallucinates or mentions outside restaurants.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ Instant Dietary & Allergy Clarifications", st_item_title)],
        [Paragraph("Instantly resolves Jain, vegan, gluten-free, nut-allergy, and spice queries. Eliminates 10+ server trips per table to ask the kitchen.", st_item_desc)],
        [Spacer(1, 6)],
        [Paragraph("✦ Continuous Sommelier Upselling (+18% to +22% Lift)", st_item_title)],
        [Paragraph("Subtly suggests high-margin beverage, bread, and dessert pairings with every main dish—boosting average bill size effortlessly.", st_item_desc)],
    ]
    t_s5_r = Table(s5_right, colWidths=[430])
    t_s5_r.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_alt),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    t_s5 = Table([[t_s5_l, t_s5_r]], colWidths=[425, 435])
    t_s5.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0), ('TOPPADDING', (0,0), (-1,-1), 0), ('BOTTOMPADDING', (0,0), (-1,-1), 0)]))
    story.append(t_s5)
    story.append(Spacer(1, 10))
    story.append(make_q_table("When guests have unique dietary questions or want pairing advice, how reassuring would it be to have an assistant that answers with your exact recipes and hospitality standards?", "HEAD CHEF & RESTAURANT OWNER"))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 6: SUBSCRIPTION TIERS (SAAS MATRIX)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("// PARTNERSHIP // ZERO FOOD COMMISSIONS", st_tag_cyan))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Three Clean Tiers. Built to Scale with Your Floor Operations.", st_title))
    story.append(Spacer(1, 10))

    # 3 Columns
    col_w = 278
    
    t1_data = [
        [Paragraph("TIER 01", ParagraphStyle('T1Tag', parent=st_card_header, fontSize=9, textColor=c_text_muted))],
        [Paragraph("Menuz View", ParagraphStyle('T1N', parent=st_title, fontSize=16, leading=19))],
        [Paragraph("Digital Menu Foundation", ParagraphStyle('T1S', parent=st_item_desc, fontSize=9, textColor=c_cyan))],
        [Spacer(1, 6)],
        [Paragraph("✓  High-Def Plating Showroom & Shelves", st_item_desc)],
        [Paragraph("✓  Calibrated Spice Meters (1 to 5)", st_item_desc)],
        [Paragraph("✓  Dietary, Jain & Allergen Badges", st_item_desc)],
        [Paragraph("✓  Instant Cloud Price & Menu Updates", st_item_desc)],
        [Paragraph("✓  Table QR Standees (0-Sec Native Scan)", st_item_desc)],
        [Paragraph("✗  Tableside Mobile Ordering", st_item_muted)],
        [Paragraph("✗  Direct Kitchen KOT & POS Integration", st_item_muted)],
        [Paragraph("✗  सारा AI Dining Concierge", st_item_muted)],
        [Paragraph("★  5★ Google Review Engine (Add-On)", ParagraphStyle('T1A', parent=st_item_desc, textColor=c_gold))],
        [Paragraph("✦  <b>0% Food Commission Always</b>", st_item_title)],
    ]
    tab_1 = Table(t1_data, colWidths=[col_w])
    tab_1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    t2_data = [
        [Paragraph("TIER 02 // MOST POPULAR", ParagraphStyle('T2Tag', parent=st_card_header, fontSize=9, textColor=c_gold))],
        [Paragraph("Menuz Order", ParagraphStyle('T2N', parent=st_title, fontSize=16, leading=19))],
        [Paragraph("Autonomous Floor Operations", ParagraphStyle('T2S', parent=st_item_desc, fontSize=9, textColor=c_gold))],
        [Spacer(1, 6)],
        [Paragraph("✓  Everything in Menuz View", st_item_desc)],
        [Paragraph("✓  Direct Tableside Mobile Ordering", st_item_desc)],
        [Paragraph("✓  Kitchen KOT & Universal POS Bridge", st_item_desc)],
        [Paragraph("✓  Multiplayer Synchronized Table Cart", st_item_desc)],
        [Paragraph("✓  Preparation Notes (Less Spicy, etc.)", st_item_desc)],
        [Paragraph("✓  Empowers Waitstaff to Handle 2x Tables", st_item_desc)],
        [Paragraph("✗  सारा AI Dining Concierge", st_item_muted)],
        [Paragraph("★  5★ Google Review Engine (Add-On)", ParagraphStyle('T2A', parent=st_item_desc, textColor=c_gold))],
        [Paragraph("✦  <b>12–15 Min Saved Per Dining Table</b>", st_item_title)],
        [Paragraph("✦  <b>0% Food Commission Always</b>", st_item_title)],
    ]
    tab_2 = Table(t2_data, colWidths=[col_w])
    tab_2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_alt),
        ('BOX', (0,0), (-1,-1), 1, c_border_gold),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    t3_data = [
        [Paragraph("TIER 03 // COMPLETE HOSPITALITY", ParagraphStyle('T3Tag', parent=st_card_header, fontSize=9, textColor=c_cyan))],
        [Paragraph("Menuz Concierge", ParagraphStyle('T3N', parent=st_title, fontSize=16, leading=19))],
        [Paragraph("Powered by सारा AI", ParagraphStyle('T3S', parent=st_item_desc, fontSize=9.5, textColor=c_gold, bold=True))],
        [Spacer(1, 6)],
        [Paragraph("✓  Everything in View & Order", st_item_desc)],
        [Paragraph("✓  Personalized सारा AI Concierge", st_item_desc)],
        [Paragraph("✓  Trained by Head Chef & Owner", st_item_desc)],
        [Paragraph("✓  Direct-to-Cart Beverage & Side Upsells", st_item_desc)],
        [Paragraph("✓  Instant Dietary & Recipe Lore Answers", st_item_desc)],
        [Paragraph("★  5★ Google Review Engine (INCLUDED)", ParagraphStyle('T3A', parent=st_item_desc, textColor=c_gold, bold=True))],
        [Paragraph("★  Gamified Spin Wheel & Inventory", ParagraphStyle('T3B', parent=st_item_desc, textColor=c_gold))],
        [Paragraph("✦  <b>+18% to +22% Average Ticket Lift</b>", st_item_title)],
        [Paragraph("✦  <b>#1 Google Maps Search Ranking</b>", st_item_title)],
        [Paragraph("✦  <b>0% Food Commission Always</b>", st_item_title)],
    ]
    tab_3 = Table(t3_data, colWidths=[col_w])
    tab_3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_high),
        ('BOX', (0,0), (-1,-1), 1, c_border_cyan),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))

    t_tiers = Table([[tab_1, tab_2, tab_3]], colWidths=[col_w + 10, col_w + 10, col_w + 10])
    t_tiers.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_tiers)
    story.append(Spacer(1, 10))
    story.append(make_q_table("Looking at your floor operations right now, which of these three tiers fits your restaurant best?", "RESTAURANT OWNER & OPERATORS"))

    doc.build(story, onFirstPage=draw_decorations, onLaterPages=draw_decorations)
    print(f"✅ Successfully built executive 6-slide PDF: {output_path}")

if __name__ == "__main__":
    out_pdf = sys.argv[1] if len(sys.argv) > 1 else "Menuz_Executive_6Slide_Pitch_Deck.pdf"
    build_pdf(out_pdf)

