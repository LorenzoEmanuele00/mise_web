## REVIEW DOCS

**_ATTENZIONE: Questo documento contiene le review al codice che verranno fatte. Leggile soltanto quando viene espressamente richiesto_**

### Review generica:

- privacy cookie e altro via di torno.
- logo non si vede
- vorrei la banda in alto di colore blu e il testo bianco e che sia uguale a in altezza a quella del titolo nell'offcanvas che entra con il menu
- vorrei un bottone donazioni (stripe????)
- facciamo un aggiustatina al logo, spazio bianco in crechio, raggio 3px più ampio dell'icona


### Domande

**Q: Ho già un vecchio sito con url misericordiadigello.it -> posso usare il dominio di quel sito registrato su register? sostituendo il vecchio sito con il nuovo hostato da vercel. tenendo quindi soltanto register come registrar?**

Sì. Tieni Register solo come registrar e nel pannello DNS di Register:

- Record **A** per `misericordiadigello.it` → `76.76.21.21` (IP Vercel)
- Record **CNAME** per `www.misericordiadigello.it` → `cname.vercel-dns.com`

Su Vercel: _Settings → Domains_ → aggiungi `misericordiadigello.it`. Vercel verificherà i record e attiverà il dominio. Propagazione DNS: da pochi minuti a 24–48 ore.

---

**Q: Per avere il sito in https abbiamo bisogno dei certificati? se si come si creano?**

No, non devi fare nulla. Vercel gestisce automaticamente i certificati SSL tramite **Let's Encrypt**: li emette e rinnova in automatico non appena il dominio è collegato e i DNS si propagano.

---

**Q: Noi non prevediamo utilizzo di GTM e google analytics. quindi non dovrebbe servire abilitare una cookiebar, ne avvisare che collezioniamo dati. giusto?**

Sostanzialmente sì, a condizione che il sito non usi altri servizi di terze parti con tracking (pixel, chat widget, etc.). Sanity non imposta cookie sul sito pubblico. Verificare che Vercel Analytics sia disabilitato o configurato in modalità privacy-first (non usa cookie). Resta comunque obbligatoria una **Privacy Policy** di base (titolare del trattamento, contatti) se il sito raccoglie email tramite form di contatto.
