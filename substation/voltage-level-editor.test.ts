import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { baseStyle } from './base-visual.js';

import { substationDoc } from '../substation.testfiles.js';

import './voltage-level-editor.js';
import type { VoltageLevelEditor } from './voltage-level-editor.js';

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

describe('Component for SCL element VoltageLevel ', () => {
  describe('with add menu open', () => {
    let editor: VoltageLevelEditor;
    beforeEach(async () => {
      const voltLv = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`VoltageLevel[name="testVoltLv1"]`)!;

      editor = await fixture(
        html`<voltage-level-editor
          .element=${voltLv}
          ?showfunctions=${true}
        ></voltage-level-editor>`,
      );
      document.body.style.width = '500';
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
      await setViewport({ width: 500, height: 500 });
      await sendMouse({ type: 'click', position: [440, 20] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `voltage-level-editor/#1 add menu visible`,
      );
    });
  });

  describe('with showfunction false', () => {
    let editor: VoltageLevelEditor;
    beforeEach(async () => {
      const voltLv = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`VoltageLevel[name="testVoltLv2"]`)!;

      editor = await fixture(
        html`<voltage-level-editor .element=${voltLv}></voltage-level-editor>`,
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
        `voltage-level-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: VoltageLevelEditor;
    beforeEach(async () => {
      const voltLv = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`VoltageLevel[name="testVoltLv3"]`)!;

      editor = await fixture(
        html`<voltage-level-editor
          .element=${voltLv}
          ?showfunctions=${true}
        ></voltage-level-editor>`,
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

      await sendMouse({ type: 'click', position: [120, 240] });

      await timeout(600);
      await visualDiff(
        document.body,
        `voltage-level-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
