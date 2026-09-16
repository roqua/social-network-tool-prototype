import type { FC, PropsWithChildren } from "react";
import { Menu, Pencil, Plus, User } from "lucide-react";

import { RoquaLogo } from "./RoquaLogo";
import "./epd-layout.css";

// Mock of the RoQua EPD shell (roqua/frontend/apps/epd PageHeader) so the
// prototype can be judged in the context it will eventually live in. Header contents are static and the buttons do nothing.
export const EpdLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="epd">
      <header className="epd-header">
        <div className="epd-header__left">
          <DossierInfo />
        </div>

        <RoquaLogo className="epd-header__logo" />

        <div className="epd-header__right">
          <button type="button" className="epd-button epd-button--outline">
            <Plus size={16} />
            Nieuwe meting
          </button>
          <button type="button" className="epd-button epd-button--outline">
            <Menu size={16} />
            Menu
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};

const DossierInfo: FC = () => {
  return (
    <div className="dossier-info">
      <div className="dossier-info__icon">
        <User size={24} />
      </div>
      <div className="dossier-info__lines">
        <div>Dhr. J. de Vries</div>
        <div className="dossier-info__meta">1234567 | Wed Mar 04 1981</div>
      </div>
      <div className="dossier-info__buttons">
        <button type="button" className="epd-button epd-button--hero-round" aria-label="Dossier bewerken">
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
};
