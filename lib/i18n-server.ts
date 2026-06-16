import { cookies, headers } from "next/headers"

import { getRequestLocale, LOCALE_COOKIE_NAME } from "@/lib/i18n"

export async function getServerLocale() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  return getRequestLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value, headerStore.get("accept-language"))
}
