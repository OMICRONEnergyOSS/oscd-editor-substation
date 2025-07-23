import { fixture, html } from '@open-wc/testing';

import { resetMouse, sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { substationDoc } from '../substation.testfiles.js';

import { baseStyle } from './base-visual.js';

import './substation-editor.js';
import type { SubstationEditor } from './substation-editor.js';

const factor = window.process && process.env.CI ? 4 : 2;
function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}
mocha.timeout(2000 * factor);

const style = document.createElement('style');
style.textContent = baseStyle;
document.body.prepend(style);

describe('Component for SCL element Private ', () => {
  describe('with showfunction false', () => {
    let editor: SubstationEditor;
    beforeEach(async () => {
      const subst = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Substation[name="AA1"]`)!;

      editor = await fixture(
        html`<substation-editor
          .element=${subst}
          ?showfunctions=${false}
          ?showuserdef=${false}
        ></substation-editor>`,
      );
      document.body.style.width = '1200';
      document.body.style.height = '800';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 1200, height: 600 });
      await sendMouse({ type: 'click', position: [50, 80] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `private-editor/#1 Unfocused with showfunction false`,
      );
    });
  });

  describe('with showfunction true and showuserdef true', () => {
    let editor: SubstationEditor;
    beforeEach(async () => {
      const subst = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Substation[name="AA1"]`)!;

      editor = await fixture(
        html`<substation-editor
          .element=${subst}
          ?showfunctions=${true}
          ?showuserdef=${true}
        ></substation-editor>`,
      );
      document.body.style.width = '1200';
      document.body.style.height = '800';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 1200, height: 600 });

      await resetMouse();
      await sendMouse({ type: 'click', position: [50, 160] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `private-editor/#2 Focused with showfunction true and showuserdef true`,
      );
    });
  });

  describe('with showfunction true and showuserdef false', () => {
    let editor: SubstationEditor;
    beforeEach(async () => {
      const subst = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Substation[name="AA1"]`)!;

      editor = await fixture(
        html`<substation-editor
          .element=${subst}
          ?showfunctions=${true}
          ?showuserdef=${false}
        ></substation-editor>`,
      );
      document.body.style.width = '1200';
      document.body.style.height = '800';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 1200, height: 600 });

      await resetMouse();

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `private-editor/#3 Focused with showfunction true and showuserdef false`,
      );
    });
  });
});
