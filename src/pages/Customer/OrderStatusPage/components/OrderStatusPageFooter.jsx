export const OrderStatusPageFooter = () => {
  return (
    <div className="mt-5 flex flex-col gap-8 bg-accent p-8 text-center">
      <div>
        <p className="font-bold">Du möchtest Artikel zurücksenden oder umtauschen?</p>
        <p>
          Melde vorab deine Rücksendung in unserem Retourenportal an und befolge alle weiteren
          Hinweise aus der Bestätigung, die du erhältst, nachdem du deine Rücksendung angemeldet
          hast.
        </p>
      </div>
      <div>
        <p className="font-bold">Reklamation und Falschlieferung</p>
        <p>
          Falls du beschädigte Produkte erhalten hast, oder gar Produkte aus deiner Bestellung
          fehlen, obwohl laut Versandbestätigung alle Produkte versendet wurden, kannst du dies
          ebenfalls über das Retourenportal anmelden.
        </p>
      </div>
      <div>
        <p className="font-bold">{`ZUM RETOURENPORTAL ->`}</p>
      </div>
      <div>
        <p>Bei weiteren Fragen schau gerne auf unserer FAQ-Seite vorbei oder wende dich über den</p>
        <p className="font-bold">
          Live-Chat oder unser Kontaktformular an unseren hilfsbereiten Kundenservice.
        </p>
      </div>
    </div>
  );
};
