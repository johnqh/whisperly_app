import { LanguageValidator as SharedLanguageValidator } from "@sudobility/components";
import { isLanguageSupported } from "../../config/constants";

export function LanguageValidator() {
  return (
    <SharedLanguageValidator
      isLanguageSupported={isLanguageSupported}
      defaultLanguage="en"
      storageKey="language"
    />
  );
}

export default LanguageValidator;
