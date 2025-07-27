import { HomeClient } from "@/components/home-client";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations('HomePage');
  
  const translations = {
    title: t('title'),
    description: t('description'),
    placeholder: t('placeholder'),
    button: t('button'),
    buttonLoading: t('buttonLoading'),
    error: t('error'),
    errorInvalid: t('errorInvalid'),
    copySuccessTitle: t('copySuccessTitle'),
    copySuccessDescription: t('copySuccessDescription'),
    copyButton: t('copyButton'),
    expiresAt: t('expiresAt'),
    expiresAtPlaceholder: t('expiresAtPlaceholder'),
    clear: t('clear'),
  };

  return <HomeClient translations={translations} />;
}
