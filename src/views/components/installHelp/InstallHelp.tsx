import { useState } from "react";
import { FiSmartphone } from "react-icons/fi";
export function InstallHelp() {
  const [open, setOpen] = useState(false);
  return <aside className="podium-install"><button onClick={() => setOpen(!open)} aria-expanded={open}><FiSmartphone aria-hidden="true" /> Le Podium sur votre écran d’accueil</button>{open && <p>Sur iPhone : dans Safari, ouvrez Partager puis « Sur l’écran d’accueil ». Sur Android : utilisez « Installer l’application » ou « Ajouter à l’écran d’accueil » dans le menu du navigateur. La réservation réelle nécessitera une connexion ; seule la préversion peut être consultée hors ligne après une première visite.</p>}</aside>;
}
