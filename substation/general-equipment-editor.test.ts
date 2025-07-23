import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { substationDoc } from '../substation.testfiles.js';

import { baseStyle } from './base-visual.js';

import './general-equipment-editor.js';
import type { GeneralEquipmentEditor } from './general-equipment-editor.js';

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

describe('Component for SCL element GeneralEquipment ', () => {
  describe('with add menu open', () => {
    let editor: GeneralEquipmentEditor;
    beforeEach(async () => {
      const subFunc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`GeneralEquipment`)!;

      editor = await fixture(
        html`<general-equipment-editor
          .element=${subFunc}
          ?showfunctions=${true}
        ></general-equipment-editor>`,
      );
      document.body.style.width = '400';
      document.body.style.height = '400';
      editor.style.position = 'absolute';
      editor.style.top = '20';
      editor.style.left = '20';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 400, height: 400 });
      await sendMouse({ type: 'click', position: [360, 20] });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(
        document.body,
        `general-equipment-editor/#1 add menu visible`,
      );
    });
  });

  describe('with showfunction false', () => {
    let editor: GeneralEquipmentEditor;
    beforeEach(async () => {
      const subFunc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`GeneralEquipment[name="someGenEquip2"]`)!;

      editor = await fixture(
        html`<general-equipment-editor
          .element=${subFunc}
        ></general-equipment-editor>`,
      );
      document.body.style.width = '200';
      document.body.style.height = '200';
      editor.style.position = 'absolute';
      editor.style.top = '80';
      editor.style.left = '50';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 100, height: 100 });
      await sendMouse({ type: 'click', position: [50, 80] });

      await editor.updateComplete;
      await timeout(400);
      await visualDiff(
        document.body,
        `general-equipment-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: GeneralEquipmentEditor;
    beforeEach(async () => {
      const lNode = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`GeneralEquipment[name="someGenEquip2"]`)!;

      editor = await fixture(
        html`<general-equipment-editor
          .element=${lNode}
          ?showfunctions=${true}
        ></general-equipment-editor>`,
      );
      document.body.style.width = '500';
      document.body.style.height = '400';
      editor.style.position = 'absolute';
      editor.style.top = '20';
      editor.style.left = '20';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 500, height: 400 });

      await sendMouse({ type: 'click', position: [120, 120] });

      await timeout(200);
      await visualDiff(
        document.body,
        `general-equipment-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
