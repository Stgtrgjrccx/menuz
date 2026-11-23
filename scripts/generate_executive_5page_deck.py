import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_executive_deck(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Brand Colors (Obsidian, Saffron Amber, Terracotta, Cyan & Emerald)
    C_BG = RGBColor(0x0A, 0x0D, 0x14)              # #0A0D14 Midnight Obsidian
    C_CARD = RGBColor(0x12, 0x18, 0x24)            # #121824 Deep Frosted Slate
    C_CARD_ALT = RGBColor(0x18, 0x22, 0x34)        # #182234 Elevated Card
    C_CARD_HIGHLIGHT = RGBColor(0x1E, 0x29, 0x3B)  # #1E293B Spotlight Card
    
    # Accents
    C_GOLD = RGBColor(0xF5, 0x9E, 0x0B)            # #F59E0B Saffron Gold
    C_TERRACOTTA = RGBColor(0xFF, 0x57, 0x22)      # #FF5722 Vibrant Terracotta
    C_CYAN = RGBColor(0x06, 0xB6, 0xD4)            # #06B6D4 Electric Cyan
    C_EMERALD = RGBColor(0x10, 0xB9, 0x81)         # #10B981 Vivid Emerald
    
    # Typography
    C_WHITE = RGBColor(0xFA, 0xFA, 0xFA)           # #FAFAFA Pure Titanium
    C_ICE = RGBColor(0xCB, 0xD5, 0xE1)             # #CBD5E1 Ice Slate
    C_MUTED = RGBColor(0x94, 0xA3, 0xB8)           # #94A3B8 Secondary Slate
    C_DARK = RGBColor(0x0F, 0x17, 0x2A)            # #0F172A

    # Borders
    C_BORDER = RGBColor(0x24, 0x30, 0x44)          # #243044 Subtle Slate Border
    C_BORDER_GOLD = RGBColor(0xD9, 0x77, 0x06)     # #D97706 Gold Border
    C_BORDER_CYAN = RGBColor(0x08, 0x91, 0xB2)     # #0891B2 Cyan Border

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, tag, title, tag_color=C_GOLD):
        # Pill Tag
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.733), Inches(0.3))
        tf_tag = tb_tag.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_left = tf_tag.margin_right = tf_tag.margin_top = tf_tag.margin_bottom = 0
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = f"// {tag.upper()}"
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = tag_color

        # Big Bold Headline
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(11.733), Inches(0.75))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_right = tf_title.margin_top = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.name = "Georgia"
        p_title.font.size = Pt(25)
        p_title.font.bold = True
        p_title.font.color.rgb = C_WHITE

    def add_card(slide, left, top, width, height, bg_color=C_CARD, border_color=C_BORDER, radius=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.5)
        else:
            card.line.fill.background()
        return card

    def add_question_box(slide, question_text, target_role="OWNER & GENERAL MANAGER"):
        # Fixed Bottom Discussion Hook
        q_card = add_card(slide, Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.85), bg_color=C_CARD_HIGHLIGHT, border_color=C_BORDER_GOLD)
        tb = slide.shapes.add_textbox(Inches(1.0), Inches(6.32), Inches(11.333), Inches(0.7))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        
        p0 = tf.paragraphs[0]
        p0.text = f"✦ CRITICAL PRE-DEVELOPMENT VALIDATION QUESTION ({target_role}):"
        p0.font.name = "Arial"
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = C_GOLD

        p1 = tf.add_paragraph()
        p1.text = f'"{question_text}"'
        p1.font.name = "Georgia"
        p1.font.size = Pt(12)
        p1.font.italic = True
        p1.font.color.rgb = C_WHITE

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 1: THE BOTTLENECK & LOST REVENUE EQUATION (TIME = MONEY)
    # ═════════════════════════════════════════════════════════════════════════
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)
    add_header(s1, "Industry Reality // Table Velocity", "Your food is crafted with art. Why is your menu just plain text?", tag_color=C_TERRACOTTA)

    # Left Container: The 15-Minute Rush-Hour Bottleneck Breakdown
    c_left = add_card(s1, Inches(0.8), Inches(1.55), Inches(5.6), Inches(4.5), bg_color=C_CARD, border_color=C_BORDER)
    tb_l = s1.shapes.add_textbox(Inches(1.05), Inches(1.75), Inches(5.1), Inches(4.1))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = tf_l.margin_right = tf_l.margin_top = tf_l.margin_bottom = 0

    p = tf_l.paragraphs[0]
    p.text = "THE 15-MINUTE RUSH-HOUR BOTTLENECK"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_TERRACOTTA

    steps = [
        ("0 to 5 Min // Menu Wait", "Guests are seated during peak rush & wait 5 minutes for busy servers to bring greasy, shared paper menus."),
        ("5 to 10 Min // Deciding Blindly", "Flipping through plain text descriptions with zero photos, guessing portion sizes, spice levels, and ingredients."),
        ("10 to 15 Min // Calling Order Takers", "Waving hands to catch an order taker's eye just to get the order manually scribbled into a paper pad.")
    ]

    for title, desc in steps:
        p_t = tf_l.add_paragraph()
        p_t.space_before = Pt(10)
        p_t.text = f"• {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_l.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = C_MUTED

    # Right Container: Paper Wear & Tear + Revenue Mathematics (Time = Money)
    c_right = add_card(s1, Inches(6.6), Inches(1.55), Inches(5.933), Inches(4.5), bg_color=C_CARD_ALT, border_color=C_BORDER)
    tb_r = s1.shapes.add_textbox(Inches(6.85), Inches(1.75), Inches(5.433), Inches(4.1))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = tf_r.margin_top = tf_r.margin_bottom = 0

    p_r0 = tf_r.paragraphs[0]
    p_r0.text = "THE WEAR & TEAR + UNCLAIMED CAPACITY"
    p_r0.font.name = "Arial"
    p_r0.font.size = Pt(12)
    p_r0.font.bold = True
    p_r0.font.color.rgb = C_GOLD

    points_r = [
        ("Paper Menus Bleed Image & Margin", "Faded laminates, taped price changes, and worn edges cost ₹15,000–₹25,000 every seasonal reprint—while failing completely to showcase the chef's culinary plating art."),
        ("The Mathematical Reality (Time = Money)", "15 minutes wasted per table × 30 dining tables during a 2.5-hour weekend peak = 7.5 hours of dead dining capacity lost every evening."),
        ("The Revenue Opportunity", "Eliminating this 15-minute ordering lag unlocks 1 additional table turnover per rush—worth ₹30,000 to ₹50,000 in uncaptured gross margin every weekend.")
    ]

    for title, desc in points_r:
        p_t = tf_r.add_paragraph()
        p_t.space_before = Pt(10)
        p_t.text = f"✦ {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_r.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = C_ICE

    add_question_box(
        s1,
        "Hypothetically, if your floor could eliminate that 15-minute ordering lag across every table during rush hours, how many more guests could you comfortably seat—and how much money is currently being left on the table?",
        "RESTAURANT OWNER & GENERAL MANAGER"
    )

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 2: THE APPLICATION IN ACTION (HOW TO USE MENUZ)
    # ═════════════════════════════════════════════════════════════════════════
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "Step 01 // Frictionless Adoption", "Point. Scan. Feast. Zero Apps, Zero Waiting.", tag_color=C_CYAN)

    # Left Container: Physical Standee & App Mockup Showcase
    c_s2_l = add_card(s2, Inches(0.8), Inches(1.55), Inches(5.6), Inches(4.5), bg_color=C_CARD, border_color=C_BORDER_CYAN)
    
    # Standee Pill Mockup
    tb_m1 = s2.shapes.add_textbox(Inches(1.05), Inches(1.75), Inches(5.1), Inches(4.1))
    tf_m1 = tb_m1.text_frame
    tf_m1.word_wrap = True
    tf_m1.margin_left = tf_m1.margin_right = tf_m1.margin_top = tf_m1.margin_bottom = 0
    
    p = tf_m1.paragraphs[0]
    p.text = "THE ZERO-APP SEAMLESS JOURNEY"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    ui_steps = [
        ("01 // Custom Tableside QR Standee", "Diner sits down & sees a weighted, dark luxury acrylic/wooden table standee with an etched table QR code."),
        ("02 // Native Camera Scan (0 Sec Wait)", "No app download. No sign-up form. No OTP. Native iOS Camera or Android Chrome opens the live menu in 0.8 seconds."),
        ("03 // Visual Culinary Showroom Wall", "Dishes appear in square high-definition frames on illuminated glass shelves with authentic textures, aromas, and prices."),
        ("04 // Instant Dietary & Spice Clarity", "Diners instantly view heat scales (1 to 5 flame meters), vegetarian badges, serving portions (grams/pieces), and allergens.")
    ]

    for title, desc in ui_steps:
        p_t = tf_m1.add_paragraph()
        p_t.space_before = Pt(8)
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_m1.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_MUTED

    # Right Container: Operational Benefits for Head Chef & Floor
    c_s2_r = add_card(s2, Inches(6.6), Inches(1.55), Inches(5.933), Inches(4.5), bg_color=C_CARD_ALT, border_color=C_BORDER)
    tb_s2_r = s2.shapes.add_textbox(Inches(6.85), Inches(1.75), Inches(5.433), Inches(4.1))
    tf_s2_r = tb_s2_r.text_frame
    tf_s2_r.word_wrap = True
    tf_s2_r.margin_left = tf_s2_r.margin_right = tf_s2_r.margin_top = tf_s2_r.margin_bottom = 0

    p = tf_s2_r.paragraphs[0]
    p.text = "WHY DINERS EAT WITH THEIR EYES"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_GOLD

    b_points = [
        ("Eliminates Ordering Indecision", "When guests see high-resolution dish plating, they decide what they want in under 2 minutes instead of 8 minutes of paper browsing."),
        ("Authentic Kitchen Representation", "No stock photography. Shows the exact portion, garnish, and plating crafted by your head chef—eliminating diner disappointment."),
        ("Real-Time Chef Agility in 3 Seconds", "Sold out of the chef's special fish? Head Chef taps 'Sold Out' on their phone & the item disappears instantly across all 40 table QR codes. No awkward waiter apologies.")
    ]

    for title, desc in b_points:
        p_t = tf_s2_r.add_paragraph()
        p_t.space_before = Pt(10)
        p_t.text = f"✦ {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_s2_r.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = C_ICE

    add_question_box(
        s2,
        "When diners can see your exact plating, colors, and portion sizes before ordering, how much faster do they make up their minds?",
        "HEAD CHEF & RESTAURANT MANAGER"
    )

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 3: MENUZ ORDER (EMPOWERING ORDER TAKERS & POS BRIDGE)
    # ═════════════════════════════════════════════════════════════════════════
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "Step 02 // Effortless Floor Operations", "Direct Tableside Orders. Built to Make Your Order Takers' Job Effortless.", tag_color=C_EMERALD)

    # Left Container: The Order Flow & POS Bridge Graphic
    c_s3_l = add_card(s3, Inches(0.8), Inches(1.55), Inches(5.6), Inches(4.5), bg_color=C_CARD, border_color=C_BORDER)
    tb_s3_l = s3.shapes.add_textbox(Inches(1.05), Inches(1.75), Inches(5.1), Inches(4.1))
    tf_s3_l = tb_s3_l.text_frame
    tf_s3_l.word_wrap = True
    tf_s3_l.margin_left = tf_s3_l.margin_right = tf_s3_l.margin_top = tf_s3_l.margin_bottom = 0

    p = tf_s3_l.paragraphs[0]
    p.text = "HOW MENUZ ORDER WORKS ON YOUR FLOOR"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD

    ops_steps = [
        ("Diner Builds Table Tray", "Guests browse dishes, select preparation specifications (Less Spicy, Extra Chutney, Jain Option), and review totals with friends."),
        ("Multiplayer Real-Time Sync", "4 diners at the same table can add dishes to the same shared live cart simultaneously from their own individual phones."),
        ("Direct POS & Thermal KOT Bridge", "Orders route directly into your existing POS system and thermal kitchen ESC/POS printers. Prints clean tickets with table number & time."),
        ("Instant Kitchen Dispatch", "Kitchen starts prep immediately while order takers remain on the floor attending to guest hospitality.")
    ]

    for title, desc in ops_steps:
        p_t = tf_s3_l.add_paragraph()
        p_t.space_before = Pt(8)
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_s3_l.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_MUTED

    # Right Container: Staff Empowerment & Time Savings
    c_s3_r = add_card(s3, Inches(6.6), Inches(1.55), Inches(5.933), Inches(4.5), bg_color=C_CARD_ALT, border_color=C_BORDER)
    tb_s3_r = s3.shapes.add_textbox(Inches(6.85), Inches(1.75), Inches(5.433), Inches(4.1))
    tf_s3_r = tb_s3_r.text_frame
    tf_s3_r.word_wrap = True
    tf_s3_r.margin_left = tf_s3_r.margin_right = tf_s3_r.margin_top = tf_s3_r.margin_bottom = 0

    p = tf_s3_r.paragraphs[0]
    p.text = "EMPOWERING ORDER TAKERS, NOT REPLACING THEM"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_GOLD

    staff_points = [
        ("Removes the Scribing Burden", "Order takers stop acting as human notepads running back and forth with pen and paper. Their job becomes effortless, fast, and organized."),
        ("Manage Twice the Tables with Zero Stress", "During Saturday night dinner rushes, a single server comfortably handles 8–10 tables instead of 4, because order entry is completely autonomous."),
        ("Zero KOT Handwriting Mistakes", "No misheard dishes, no forgotten dietary notes, and no kitchen disputes over scribbled tickets."),
        ("12 to 15 Minutes Reclaimed Every Table", "Guests get food faster, finish dining without unnecessary delays, and leave delighted—multiplying total floor revenue.")
    ]

    for title, desc in staff_points:
        p_t = tf_s3_r.add_paragraph()
        p_t.space_before = Pt(8)
        p_t.text = f"✦ {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_s3_r.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_ICE

    add_question_box(
        s3,
        "On a packed Saturday night, how much smoother would your floor run if your order takers didn't have to sprint back and forth just to punch initial orders into the system?",
        "GENERAL MANAGER & RESTAURANT OWNER"
    )

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 4: THE REPUTATION ENGINE (WIN CHALLENGE & 5★ GOOGLE REVIEWS)
    # ═════════════════════════════════════════════════════════════════════════
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "Step 03 // Viral Reputation Hook", "Gamified Table Rewards. 50+ Verified 5-Star Google Reviews Every Week.", tag_color=C_GOLD)

    # Left Container: The 4-Step Gamified Loop
    c_s4_l = add_card(s4, Inches(0.8), Inches(1.55), Inches(5.6), Inches(4.5), bg_color=C_CARD, border_color=C_BORDER_GOLD)
    tb_s4_l = s4.shapes.add_textbox(Inches(1.05), Inches(1.75), Inches(5.1), Inches(4.1))
    tf_s4_l = tb_s4_l.text_frame
    tf_s4_l.word_wrap = True
    tf_s4_l.margin_left = tf_s4_l.margin_right = tf_s4_l.margin_top = tf_s4_l.margin_bottom = 0

    p = tf_s4_l.paragraphs[0]
    p.text = "THE 4-STEP REPUTATION MULTIPLIER"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_GOLD

    loop_steps = [
        ("01 // The Tableside Win Toggle", "While browsing the visual menu, diners see a subtle 'Win Table Rewards' badge inviting them to spin for a reward."),
        ("02 // Smart Keyword Review Builder", "Diners tap 3 recommended prompt chips ('Crispy Paneer', 'Great Ambience', 'Lightning Fast'). Menuz instantly crafts a high-SEO authentic review."),
        ("03 // 1-Tap Copy & Paste to Google", "Diner copies with 1 tap, opens Google Maps in 1 tap, and pastes their glowing 5-star review in under 10 seconds."),
        ("04 // Spin Wheel Unlocks Instantly", "Once review is submitted and checked, the gamified wheel unlocks with a live spin animation to award their table reward!")
    ]

    for title, desc in loop_steps:
        p_t = tf_s4_l.add_paragraph()
        p_t.space_before = Pt(8)
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_s4_l.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_MUTED

    # Right Container: 100% Owner Control & Organic Footfall Impact
    c_s4_r = add_card(s4, Inches(6.6), Inches(1.55), Inches(5.933), Inches(4.5), bg_color=C_CARD_ALT, border_color=C_BORDER)
    tb_s4_r = s4.shapes.add_textbox(Inches(6.85), Inches(1.75), Inches(5.433), Inches(4.1))
    tf_s4_r = tb_s4_r.text_frame
    tf_s4_r.word_wrap = True
    tf_s4_r.margin_left = tf_s4_r.margin_right = tf_s4_r.margin_top = tf_s4_r.margin_bottom = 0

    p = tf_s4_r.paragraphs[0]
    p.text = "100% OWNER CONTROL & LOCAL SEARCH DOMINANCE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    rep_points = [
        ("Completely Owner-Customizable Rewards", "What diners win is 100% up to the restaurant owner: Free Welcome Mocktail, Chef's Signature Dessert, Free Appetizer, or 10% Off Next Visit. Cap daily voucher limits with 1 click."),
        ("Totally Optional, Yet the #1 Guest Hook", "Diners don't feel pressured—they feel rewarded. Turning wait time into a fun table game drives unprecedented 80%+ review participation."),
        ("Permanent Google Maps Top-3 Ranking", "Generating 30–50 verified local reviews every week pushes your restaurant to the #1 spot on Google Search & Maps for local dining queries.")
    ]

    for title, desc in rep_points:
        p_t = tf_s4_r.add_paragraph()
        p_t.space_before = Pt(10)
        p_t.text = f"✦ {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_s4_r.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = C_ICE

    add_question_box(
        s4,
        "If every table had a fun, 30-second reason to leave you a glowing Google review before paying the bill, what would that do for your weekend footfall?",
        "RESTAURANT OWNER & MARKETING HEAD"
    )

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 5: MENUZ CONCIERGE (POWERED BY सारा AI)
    # ═════════════════════════════════════════════════════════════════════════
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "Step 04 // Culinary Intelligence", "Menuz Concierge: Powered by सारा AI. Trained by the Head Chef & Owner.", tag_color=C_GOLD)

    # Left Container: Live Conversation Mockup
    c_s5_l = add_card(s5, Inches(0.8), Inches(1.55), Inches(5.6), Inches(4.5), bg_color=C_CARD, border_color=C_BORDER_GOLD)
    tb_s5_l = s5.shapes.add_textbox(Inches(1.05), Inches(1.75), Inches(5.1), Inches(4.1))
    tf_s5_l = tb_s5_l.text_frame
    tf_s5_l.word_wrap = True
    tf_s5_l.margin_left = tf_s5_l.margin_right = tf_s5_l.margin_top = tf_s5_l.margin_bottom = 0

    p = tf_s5_l.paragraphs[0]
    p.text = "LIVE CONVERSATION WITH सारा AI"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_GOLD

    # Chat Bubble 1: Diner
    p_d1 = tf_s5_l.add_paragraph()
    p_d1.space_before = Pt(8)
    p_d1.text = "DINER (Table 4):"
    p_d1.font.name = "Arial"
    p_d1.font.size = Pt(10)
    p_d1.font.bold = True
    p_d1.font.color.rgb = C_ICE

    p_d2 = tf_s5_l.add_paragraph()
    p_d2.text = '"We have kids with us—is the Murgh Biryani too spicy, and what side pairs best with it?"'
    p_d2.font.name = "Georgia"
    p_d2.font.size = Pt(11)
    p_d2.font.italic = True
    p_d2.font.color.rgb = C_WHITE

    # Chat Bubble 2: सारा AI Response
    p_a1 = tf_s5_l.add_paragraph()
    p_a1.space_before = Pt(8)
    p_a1.text = "सारा AI (Trained on Chef's Kitchen Lore):"
    p_a1.font.name = "Arial"
    p_a1.font.size = Pt(10)
    p_a1.font.bold = True
    p_a1.font.color.rgb = C_GOLD

    p_a2 = tf_s5_l.add_paragraph()
    p_a2.text = '"Chef Ranveer prepares the Murgh Biryani with slow-cooked Awadhi dum. It has a rich aroma but mild heat (2/5), perfect for families! I recommend pairing it with our Smoked Saffron Raita (₹180)."'
    p_a2.font.name = "Georgia"
    p_a2.font.size = Pt(10.5)
    p_a2.font.italic = True
    p_a2.font.color.rgb = C_ICE

    # Direct Cart Addition Note
    p_btn = tf_s5_l.add_paragraph()
    p_btn.space_before = Pt(8)
    p_btn.text = "▶ [ + Add to Table Tray • ₹180 ] (1-Tap Direct Add)"
    p_btn.font.name = "Arial"
    p_btn.font.size = Pt(10.5)
    p_btn.font.bold = True
    p_btn.font.color.rgb = C_EMERALD

    p_rule = tf_s5_l.add_paragraph()
    p_rule.space_before = Pt(6)
    p_rule.text = "SECURITY GUARANTEE: Items can be added directly to the cart from सारा AI, but orders can NEVER be placed directly from chat—preventing accidental orders."
    p_rule.font.name = "Arial"
    p_rule.font.size = Pt(9.5)
    p_rule.font.bold = True
    p_rule.font.color.rgb = C_MUTED

    # Right Container: Operational & Revenue Benefits
    c_s5_r = add_card(s5, Inches(6.6), Inches(1.55), Inches(5.933), Inches(4.5), bg_color=C_CARD_ALT, border_color=C_BORDER)
    tb_s5_r = s5.shapes.add_textbox(Inches(6.85), Inches(1.75), Inches(5.433), Inches(4.1))
    tf_s5_r = tb_s5_r.text_frame
    tf_s5_r.word_wrap = True
    tf_s5_r.margin_left = tf_s5_r.margin_right = tf_s5_r.margin_top = tf_s5_r.margin_bottom = 0

    p = tf_s5_r.paragraphs[0]
    p.text = "LIKE TALKING DIRECTLY TO THE HEAD CHEF & OWNER"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    ai_points = [
        ("Custom-Trained on Your Menu Only", "Not an open-ended generic bot. सारा AI is strictly grounded in your recipes, ingredients, allergen profiles, and story. It never hallucinates or mentions outside restaurants."),
        ("Instant Dietary & Allergy Clarifications", "Instantly resolves Jain, vegan, gluten-free, nut-allergy, and spice queries. Eliminates 10+ server trips per table to ask the kitchen."),
        ("Continuous Sommelier Upselling (+18% to +22% Lift)", "Subtly suggests high-margin beverage, bread, and dessert pairings with every main dish—boosting average bill size effortlessly.")
    ]

    for title, desc in ai_points:
        p_t = tf_s5_r.add_paragraph()
        p_t.space_before = Pt(10)
        p_t.text = f"✦ {title}"
        p_t.font.name = "Arial"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE

        p_d = tf_s5_r.add_paragraph()
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = C_ICE

    add_question_box(
        s5,
        "When guests have unique dietary questions or want pairing advice, how reassuring would it be to have an assistant that answers with your exact recipes and hospitality standards?",
        "HEAD CHEF & RESTAURANT OWNER"
    )

    # ═════════════════════════════════════════════════════════════════════════
    # SLIDE 6: SUBSCRIPTION TIERS (INDUSTRY-STANDARD SAAS MATRIX)
    # ═════════════════════════════════════════════════════════════════════════
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "Partnership // Zero Food Commissions", "Three Clean Tiers. Built to Scale with Your Floor Operations.", tag_color=C_CYAN)

    # 3 SaaS Columns (Toast / Shopify Style)
    col_w = Inches(3.75)
    gap = Inches(0.24)
    top_pos = Inches(1.55)
    card_h = Inches(4.5)

    # ─────────────────────────────────────────────────────────────────────────
    # TIER 1: MENUZ VIEW
    # ─────────────────────────────────────────────────────────────────────────
    left_1 = Inches(0.8)
    add_card(s6, left_1, top_pos, col_w, card_h, bg_color=C_CARD, border_color=C_BORDER)
    tb_t1 = s6.shapes.add_textbox(left_1 + Inches(0.25), top_pos + Inches(0.2), col_w - Inches(0.5), card_h - Inches(0.4))
    tf_t1 = tb_t1.text_frame
    tf_t1.word_wrap = True
    tf_t1.margin_left = tf_t1.margin_right = tf_t1.margin_top = tf_t1.margin_bottom = 0

    p = tf_t1.paragraphs[0]
    p.text = "TIER 01"
    p.font.name = "Arial"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_MUTED

    p_name = tf_t1.add_paragraph()
    p_name.text = "Menuz View"
    p_name.font.name = "Georgia"
    p_name.font.size = Pt(20)
    p_name.font.bold = True
    p_name.font.color.rgb = C_WHITE

    p_sub = tf_t1.add_paragraph()
    p_sub.text = "Digital Menu Foundation"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(10.5)
    p_sub.font.color.rgb = C_CYAN

    t1_features = [
        "✓  High-Def Plating Showroom & Shelves",
        "✓  Calibrated Spice Meters (1 to 5)",
        "✓  Dietary, Jain & Allergen Badges",
        "✓  Instant Cloud Price & Menu Updates",
        "✓  Table QR Standees (0-Sec Native Scan)",
        "✗  Tableside Mobile Ordering",
        "✗  Direct Kitchen KOT & POS Integration",
        "✗  सारा AI Dining Concierge",
        "★  5★ Google Review Engine (Add-On)",
        "✦  0% Food Commission Always"
    ]
    for feat in t1_features:
        p_f = tf_t1.add_paragraph()
        p_f.space_before = Pt(6)
        p_f.text = feat
        p_f.font.name = "Arial"
        p_f.font.size = Pt(10)
        p_f.font.color.rgb = C_MUTED if "✗" in feat else (C_GOLD if "★" in feat else C_ICE)

    # ─────────────────────────────────────────────────────────────────────────
    # TIER 2: MENUZ ORDER (MOST POPULAR)
    # ─────────────────────────────────────────────────────────────────────────
    left_2 = left_1 + col_w + gap
    add_card(s6, left_2, top_pos, col_w, card_h, bg_color=C_CARD_ALT, border_color=C_BORDER_GOLD)
    tb_t2 = s6.shapes.add_textbox(left_2 + Inches(0.25), top_pos + Inches(0.2), col_w - Inches(0.5), card_h - Inches(0.4))
    tf_t2 = tb_t2.text_frame
    tf_t2.word_wrap = True
    tf_t2.margin_left = tf_t2.margin_right = tf_t2.margin_top = tf_t2.margin_bottom = 0

    p = tf_t2.paragraphs[0]
    p.text = "TIER 02 // MOST POPULAR"
    p.font.name = "Arial"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_GOLD

    p_name = tf_t2.add_paragraph()
    p_name.text = "Menuz Order"
    p_name.font.name = "Georgia"
    p_name.font.size = Pt(20)
    p_name.font.bold = True
    p_name.font.color.rgb = C_WHITE

    p_sub = tf_t2.add_paragraph()
    p_sub.text = "Autonomous Floor Operations"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(10.5)
    p_sub.font.color.rgb = C_GOLD

    t2_features = [
        "✓  Everything in Menuz View",
        "✓  Direct Tableside Mobile Ordering",
        "✓  Kitchen KOT & Universal POS Bridge",
        "✓  Multiplayer Synchronized Table Cart",
        "✓  Preparation Notes (Less Spicy, Extra Chutney)",
        "✓  Empowers Waitstaff to Handle 2x Tables",
        "✗  सारा AI Dining Concierge",
        "★  5★ Google Review Engine (Add-On)",
        "✦  12–15 Min Saved Per Dining Table",
        "✦  0% Food Commission Always"
    ]
    for feat in t2_features:
        p_f = tf_t2.add_paragraph()
        p_f.space_before = Pt(6)
        p_f.text = feat
        p_f.font.name = "Arial"
        p_f.font.size = Pt(10)
        p_f.font.color.rgb = C_MUTED if "✗" in feat else (C_GOLD if "★" in feat else C_ICE)

    # ─────────────────────────────────────────────────────────────────────────
    # TIER 3: MENUZ CONCIERGE (POWERED BY सारा AI)
    # ─────────────────────────────────────────────────────────────────────────
    left_3 = left_2 + col_w + gap
    add_card(s6, left_3, top_pos, col_w, card_h, bg_color=C_CARD_HIGHLIGHT, border_color=C_BORDER_CYAN)
    tb_t3 = s6.shapes.add_textbox(left_3 + Inches(0.25), top_pos + Inches(0.2), col_w - Inches(0.5), card_h - Inches(0.4))
    tf_t3 = tb_t3.text_frame
    tf_t3.word_wrap = True
    tf_t3.margin_left = tf_t3.margin_right = tf_t3.margin_top = tf_t3.margin_bottom = 0

    p = tf_t3.paragraphs[0]
    p.text = "TIER 03 // COMPLETE HOSPITALITY"
    p.font.name = "Arial"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    p_name = tf_t3.add_paragraph()
    p_name.text = "Menuz Concierge"
    p_name.font.name = "Georgia"
    p_name.font.size = Pt(20)
    p_name.font.bold = True
    p_name.font.color.rgb = C_WHITE

    p_sub = tf_t3.add_paragraph()
    p_sub.text = "Powered by सारा AI"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(11)
    p_sub.font.bold = True
    p_sub.font.color.rgb = C_GOLD

    t3_features = [
        "✓  Everything in View & Order",
        "✓  Personalized सारा AI Concierge",
        "✓  Trained by Head Chef & Owner",
        "✓  Direct-to-Cart Beverage & Side Upsells",
        "✓  Instant Dietary & Recipe Lore Clarifications",
        "✓  5★ Google Review Engine (INCLUDED)",
        "✓  Gamified Spin Wheel & Reward Inventory",
        "✦  +18% to +22% Average Ticket Size Lift",
        "✦  #1 Google Maps Search Ranking",
        "✦  0% Food Commission Always"
    ]
    for feat in t3_features:
        p_f = tf_t3.add_paragraph()
        p_f.space_before = Pt(6)
        p_f.text = feat
        p_f.font.name = "Arial"
        p_f.font.size = Pt(10)
        p_f.font.color.rgb = C_GOLD if "INCLUDED" in feat else C_WHITE

    add_question_box(
        s6,
        "Looking at your floor operations right now, which of these three tiers fits your restaurant best?",
        "RESTAURANT OWNER & OPERATORS"
    )

    # Save output presentation
    prs.save(output_path)
    print(f"✅ Successfully built executive 6-slide deck: {output_path}")

if __name__ == "__main__":
    out_file = sys.argv[1] if len(sys.argv) > 1 else "Menuz_Executive_6Slide_Pitch_Deck.pptx"
    build_executive_deck(out_file)

