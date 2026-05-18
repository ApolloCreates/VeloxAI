from playwright.sync_api import sync_playwright


# =========================
# MAIN ENTRY FUNCTION
# =========================
def apply_to_job(url: str, name: str, email: str, resume_path: str):

    # 🔀 Route based on site
    if "internshala" in url:
        return apply_internshala(url, name, email, resume_path)

    elif "linkedin" in url:
        return {
            "status": "failed",
            "error": "LinkedIn blocks automation (manual apply recommended)"
        }

    else:
        return generic_apply(url, name, email, resume_path)


# =========================
# GENERIC APPLY (SMART BOT)
# =========================
def generic_apply(url: str, name: str, email: str, resume_path: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # set True later
        page = browser.new_page()

        try:
            page.goto(url, timeout=60000)

            # 🧠 Wait for page load
            page.wait_for_timeout(2000)

            # =========================
            # 🎯 FILL INPUT FIELDS
            # =========================
            inputs = page.locator("input").all()

            for input_box in inputs:
                try:
                    field_name = input_box.get_attribute("name") or ""
                    placeholder = input_box.get_attribute("placeholder") or ""
                    field = (field_name + placeholder).lower()

                    if "name" in field:
                        input_box.fill(name)

                    elif "email" in field:
                        input_box.fill(email)

                except:
                    continue

            # =========================
            # 📄 FILE UPLOAD
            # =========================
            try:
                file_inputs = page.locator("input[type='file']").all()
                for file_input in file_inputs:
                    file_input.set_input_files(resume_path)
            except:
                pass

            # =========================
            # 🚀 SUBMIT FORM
            # =========================
            buttons = page.locator("button").all()

            submitted = False
            for btn in buttons:
                try:
                    text = btn.inner_text().lower()

                    if any(word in text for word in ["apply", "submit", "send"]):
                        btn.click()
                        submitted = True
                        break
                except:
                    continue

            page.wait_for_timeout(2000)

            if not submitted:
                return {
                    "status": "failed",
                    "error": "No submit button found",
                    "url": url
                }

            return {
                "status": "success",
                "message": "Application submitted (generic)",
                "url": url
            }

        except Exception as e:
            return {
                "status": "failed",
                "error": str(e),
                "url": url
            }

        finally:
            browser.close()


# =========================
# INTERN SHALA HANDLER
# =========================
def apply_internshala(url: str, name: str, email: str, resume_path: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        try:
            page.goto(url, timeout=60000)
            page.wait_for_timeout(2000)

            # ⚠️ Internshala usually requires login
            return {
                "status": "failed",
                "error": "Internshala requires login (automation limited)",
                "url": url
            }

        except Exception as e:
            return {
                "status": "failed",
                "error": str(e),
                "url": url
            }

        finally:
            browser.close()