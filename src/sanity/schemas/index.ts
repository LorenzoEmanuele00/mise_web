import page from "./documents/page";
import post from "./documents/post";
import galleria from "./documents/galleria";
import servizio from "./documents/servizio";
import mezzo from "./documents/mezzo";
import settings from "./documents/settings";
import servizioCivile from "./documents/servizioCivile";
import contactSubmission from "./documents/contactSubmission";
import volunteerSubmission from "./documents/volunteerSubmission";
import seo from "./objects/seo";
import heroSection from "./objects/heroSection";
import timelineEvent from "./objects/timelineEvent";
import tipoServizio from "./objects/tipoServizio";
import scProgetto from "./objects/scProgetto";
import scStep from "./objects/scStep";
import scTestimonianza from "./objects/scTestimonianza";
import scFaq from "./objects/scFaq";
import r2Image from "./objects/r2Image";

export const schemaTypes = [
  // Documents
  page,
  post,
  galleria,
  servizio,
  mezzo,
  settings,
  servizioCivile,
  contactSubmission,
  volunteerSubmission,
  // Objects
  r2Image,
  seo,
  heroSection,
  timelineEvent,
  tipoServizio,
  scProgetto,
  scStep,
  scTestimonianza,
  scFaq,
];
