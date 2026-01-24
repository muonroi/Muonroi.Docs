# Multi-factor Authentication

This project includes a minimal WebAuthn / passkey implementation in `Auth.Mfa.WebAuthn`.

- Registration and login use the WebAuthn standard and are intended for phishing-resistant MFA.
- Sensitive actions MUST enforce **Authentication Assurance Level 2** (AAL2) or higher as defined in [NIST SP 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html).
- Syncable authenticators (for example, passkeys backed up to cloud accounts) are supported following the 2024 supplement to NIST 800-63B and are treated as AAL3 while still satisfying the AAL2 requirement.

## Usage

`WebAuthnService` exposes registration and authentication helpers. It deliberately omits the full FIDO2 protocol details so that applications can provide their own storage and ceremony handling.
