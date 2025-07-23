import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { baseStyle } from './base-visual.js';

import { substationDoc } from '../substation.testfiles.js';

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

describe('Component for SCL element Substation ', () => {
  describe('with add menu open', () => {
    let editor: SubstationEditor;
    beforeEach(async () => {
      const voltLv = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Substation[name="testSubst1"]`)!;

      editor = await fixture(
        html`<substation-editor
          .element=${voltLv}
          ?showfunctions=${true}
        ></substation-editor>`,
      );
      document.body.style.width = '320';
      document.body.style.height = '500';
      editor.style.position = 'absolute';
      editor.style.top = '20';
      editor.style.left = '20';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 320, height: 500 });
      await sendMouse({ type: 'click', position: [280, 20] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(document.body, `substation-editor/#1 add menu visible`);
    });
  });

  describe('with showfunction false', () => {
    let editor: SubstationEditor;
    beforeEach(async () => {
      const voltLv = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Substation[name="testSubst2"]`)!;

      editor = await fixture(
        html`<substation-editor .element=${voltLv}></substation-editor>`,
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
      // await sendMouse({ type: 'click', position: [300, 80] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `substation-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: SubstationEditor;
    beforeEach(async () => {
      const voltLv = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Substation[name="testSubst2"]`)!;

      editor = await fixture(
        html`<substation-editor
          .element=${voltLv}
          ?showfunctions=${true}
        ></substation-editor>`,
      );
      document.body.style.width = '1200';
      document.body.style.height = '2200';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 400, height: 800 });

      await sendMouse({ type: 'click', position: [600, 240] });

      await timeout(600);
      await visualDiff(
        document.body,
        `substation-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
