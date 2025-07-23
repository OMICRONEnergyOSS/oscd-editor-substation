import { LitElement, html, TemplateResult, css } from 'lit';
import { property, state } from 'lit/decorators.js';

import '@material/mwc-icon-button-toggle';

import { renderSubstations } from './substation/substation-editor.js';
import { renderLines } from './substation/line-editor.js';
import { renderProcesses } from './substation/process-editor.js';
import { getChildElementsByTagName } from './foundation.js';

function shouldShowFunctions(): boolean {
  return localStorage.getItem('showfunctions') === 'on';
}

function setShowFunctions(value: 'on' | 'off') {
  localStorage.setItem('showfunctions', value);
}

function shouldShowUserDef(): boolean {
  return localStorage.getItem('showuserdef') === 'on';
}

function setShowUserDef(value: 'on' | 'off') {
  localStorage.setItem('showuserdef', value);
}

/** An editor [[`plugin`]] for editing the `Substation` section. */
export default class OscdEditorSubstation extends LitElement {
  /** The document being edited as provided to plugins by [[`OpenSCD`]]. */
  @property({ type: Object })
  doc!: XMLDocument;

  @property({ type: Object })
  docs!: Record<string, XMLDocument>;

  @property({ type: Number })
  editCount = -1;

  @state()
  get substations(): Element[] {
    return getChildElementsByTagName(this.doc.documentElement, 'Substation');
  }

  @state()
  get lines(): Element[] {
    return getChildElementsByTagName(this.doc.documentElement, 'Line');
  }

  @state()
  get processes(): Element[] {
    return getChildElementsByTagName(this.doc.documentElement, 'Process');
  }

  toggleShowFunctions(): void {
    if (shouldShowFunctions()) setShowFunctions('off');
    else setShowFunctions('on');
    this.requestUpdate();
  }

  toggleShowUserDef(): void {
    if (shouldShowUserDef()) setShowUserDef('off');
    else setShowUserDef('on');
    this.requestUpdate();
  }

  render(): TemplateResult {
    if (!this.doc)
      return html`<h1>
        <span style="color: var(--oscd-theme-base1)">No SCL file loaded</span>
      </h1>`;

    if (
      !this.substations.length &&
      !this.lines.length &&
      !this.processes.length
    )
      return html`<h1>
        <span style="color: var(--oscd-theme-base1)"
          >No Substation section in the project</span
        >
      </h1>`;

    return html`<h1>
        <nav>
          <abbr title="Filter user-defined information">
            <mwc-icon-button-toggle
              ?on=${shouldShowUserDef()}
              @click=${() => this.toggleShowUserDef()}
              id="showuserdef"
              onIcon="subtitles"
              offIcon="subtitles_off"
              ?disabled="${!shouldShowFunctions()}"
            ></mwc-icon-button-toggle>
          </abbr>
          <abbr title="Show Function Structure">
            <mwc-icon-button-toggle
              ?on=${shouldShowFunctions()}
              @click=${() => this.toggleShowFunctions()}
              id="showfunctions"
              onIcon="layers"
              offIcon="layers_clear"
            ></mwc-icon-button-toggle>
          </abbr>
        </nav>
      </h1>
      <section>
        ${renderSubstations(
          this.doc.documentElement,
          this.editCount,
          shouldShowFunctions(),
          shouldShowUserDef(),
        )}
        ${renderLines(
          this.doc.documentElement,
          this.editCount,
          shouldShowFunctions(),
          shouldShowUserDef(),
        )}
        ${renderProcesses(
          this.doc.documentElement,
          this.editCount,
          shouldShowFunctions(),
          shouldShowUserDef(),
        )}
      </section>`;
  }

  static styles = css`
    h1 {
      color: var(--mdc-theme-on-surface);
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0px;
      line-height: 48px;
      padding-left: 0.3em;
      transition: background-color 150ms linear;
    }

    h1 > nav,
    h1 > abbr > mwc-icon-button {
      float: right;
    }

    section {
      padding: 8px 12px 16px;
      display: grid;
      gap: 12px;
    }

    abbr {
      text-decoration: none;
      border-bottom: none;
    }

    * {
      --oscd-action-pane-theme-surface: var(--oscd-base3);
      --oscd-action-pane-theme-on-surface: var(--oscd-base00);
      --oscd-action-pane-theme-on-primary: var(--oscd-base2);
      --oscd-action-pane-theme-font: 'Roboto';
      --oscd-action-icon-theme-font: 'Roboto';

      --oscd-action-icon-theme-on-surface: var(--oscd-base00);
      --oscd-action-icon-theme-on-primary: var(--oscd-base2);
    }

    :host {
      width: 100vw;
    }
  `;
}
