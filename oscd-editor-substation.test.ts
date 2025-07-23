import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { missingSubstation, substationDoc } from './substation.testfiles.js';

import OscdEditorSubstation from './oscd-editor-substation.js';
import { baseStyle } from './substation/base-visual.js';

const factor = window.process && process.env.CI ? 4 : 2;
function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}
mocha.timeout(2000 * factor);

const missingSubSt = new DOMParser().parseFromString(
  missingSubstation,
  'application/xml',
);

const substDoc = new DOMParser().parseFromString(
  substationDoc,
  'application/xml',
);

const style = document.createElement('style');
style.textContent = baseStyle;
document.body.prepend(style);

describe('SclCommunication editor component', () => {
  customElements.define('scl-substation-plugin', OscdEditorSubstation);
  let editor: OscdEditorSubstation;

  describe('with missing doc ', () => {
    beforeEach(async () => {
      editor = await fixture(
        html`<scl-substation-plugin></scl-substation-plugin>`,
      );
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 1200, height: 800 });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(
        document.body,
        `scl-substation-editor/#1 Missing Document`,
      );
    });
  });

  describe('with Substation section ', () => {
    beforeEach(async () => {
      editor = await fixture(
        html`<scl-substation-plugin
          .doc=${missingSubSt}
        ></scl-substation-plugin>`,
      );
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 1200, height: 800 });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(
        document.body,
        `scl-substation-editor/#2 Missing Substation section`,
      );
    });
  });

  describe('with Substation present ', () => {
    beforeEach(async () => {
      editor = await fixture(
        html`<scl-substation-plugin .doc=${substDoc}></scl-substation-plugin>`,
      );
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 1200, height: 800 });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(document.body, `scl-substation-editor/#3 Substation`);
    });
  });

  describe('with function filter toggled ', () => {
    beforeEach(async () => {
      editor = await fixture(
        html`<scl-substation-plugin .doc=${substDoc}></scl-substation-plugin>`,
      );
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 1200, height: 800 });

      await sendMouse({ type: 'click', position: [1180, 20] });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(
        document.body,
        `scl-substation-editor/#4 Function filter toggled`,
      );
    });
  });

  describe('with function and user-defined filter toggled ', () => {
    beforeEach(async () => {
      editor = await fixture(
        html`<scl-substation-plugin .doc=${substDoc}></scl-substation-plugin>`,
      );
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 1200, height: 800 });

      // await sendMouse({ type: 'click', position: [1180, 20] });
      // await resetMouse();
      await sendMouse({ type: 'click', position: [1120, 20] });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(
        document.body,
        `scl-substation-editor/#5 Function and user-defined filter toggled`,
      );
    });
  });
});
