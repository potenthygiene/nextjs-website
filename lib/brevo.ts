// Adds a newsletter sign-up to the Brevo list. Does nothing until
// BREVO_API_KEY and BREVO_LIST_ID are set in the environment, and never
// throws, so a Brevo outage cannot break the sign-up form.
export async function addToBrevoList(email: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) return false;

  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const doubleOptIn = Boolean(templateId);

  try {
    const res = await fetch(
      doubleOptIn
        ? "https://api.brevo.com/v3/contacts/doubleOptinConfirmation"
        : "https://api.brevo.com/v3/contacts",
      {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(
          doubleOptIn
            ? {
                email,
                includeListIds: [listId],
                templateId,
                redirectionUrl:
                  process.env.BREVO_DOI_REDIRECT_URL ||
                  "https://www.potenthygiene.com/",
              }
            : // Signing up again re-subscribes someone who unsubscribed before.
              { email, listIds: [listId], updateEnabled: true, emailBlacklisted: false },
        ),
        cache: "no-store",
      },
    );
    // 201/204 = added; 400 = already on the list.
    return res.ok || res.status === 400;
  } catch {
    return false;
  }
}
