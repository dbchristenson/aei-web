from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter(tags=["contact"])


class ContactRequest(BaseModel):
    name: str
    organization: str = ""
    email: EmailStr
    phone: str = ""
    message: str
    honeypot: str = ""  # Spam prevention — should be empty


@router.post("/contact")
async def submit_contact(data: ContactRequest):
    """Handle contact form submissions."""
    # Spam check: honeypot field should be empty
    if data.honeypot:
        # Silently accept but don't process
        return {"status": "ok"}

    # TODO: Store in database and/or send notification email
    return {"status": "ok"}
