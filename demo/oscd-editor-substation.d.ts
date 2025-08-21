import { LitElement, TemplateResult } from 'lit';
import '@material/mwc-icon-button-toggle';
/** An editor [[`plugin`]] for editing the `Substation` section. */
export default class OscdEditorSubstation extends LitElement {
    /** The document being edited as provided to plugins by [[`OpenSCD`]]. */
    doc: XMLDocument;
    docs: Record<string, XMLDocument>;
    editCount: number;
    get substations(): Element[];
    get lines(): Element[];
    get processes(): Element[];
    toggleShowFunctions(): void;
    toggleShowUserDef(): void;
    render(): TemplateResult;
    static styles: import("lit").CSSResult;
}
