import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { substationDoc } from '../substation.testfiles.js';

import { baseStyle } from './base-visual.js';

import './eq-sub-function-editor.js';
import type { EqSubFunctionEditor } from './eq-sub-function-editor.js';

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

describe('Component for SCL element EqSubFunction ', () => {
  describe('with add menu open', () => {
    let editor: EqSubFunctionEditor;
    beforeEach(async () => {
      const subFunc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`EqSubFunction`)!;

      editor = await fixture(
        html`<eq-sub-function-editor
          .element=${subFunc}
        ></eq-sub-function-editor>`,
      );
      document.body.style.width = '800';
      document.body.style.height = '900';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 800, height: 900 });
      await sendMouse({ type: 'click', position: [780, 20] });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(
        document.body,
        `eq-sub-function-editor/#1 add menu visible`,
      );
    });
  });

  describe('with showfunction false', () => {
    let editor: EqSubFunctionEditor;
    beforeEach(async () => {
      const subFunc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`EqSubFunction`)!;

      editor = await fixture(
        html`<eq-sub-function-editor
          .element=${subFunc}
        ></eq-sub-function-editor>`,
      );
      document.body.style.width = '800';
      document.body.style.height = '900';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 800, height: 900 });
      await sendMouse({ type: 'click', position: [30, 30] });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(
        document.body,
        `eq-sub-function-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: EqSubFunctionEditor;
    beforeEach(async () => {
      const lNode = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`EqSubFunction`)!;

      editor = await fixture(
        html`<eq-sub-function-editor
          .element=${lNode}
          ?showfunctions=${true}
        ></eq-sub-function-editor>`,
      );
      document.body.style.width = '800';
      document.body.style.height = '900';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 800, height: 900 });

      await sendMouse({ type: 'click', position: [120, 120] });

      await timeout(200);
      await visualDiff(
        document.body,
        `eq-sub-function-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
