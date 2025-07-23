import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { substationDoc } from '../substation.testfiles.js';

import { baseStyle } from './base-visual.js';

import './conducting-equipment-editor.js';
import type { ConductingEquipmentEditor } from './conducting-equipment-editor.js';

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

describe('Component for SCL element ConductingEquipment ', () => {
  describe('with add menu open', () => {
    let editor: ConductingEquipmentEditor;
    beforeEach(async () => {
      const subFunc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`ConductingEquipment[name="QA2"]`)!;

      editor = await fixture(
        html`<conducting-equipment-editor
          .element=${subFunc}
          ?showfunctions=${true}
        ></conducting-equipment-editor>`,
      );
      document.body.style.width = '450';
      document.body.style.height = '600';
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
        `conducting-equipment-editor/#1 add menu visible`,
      );
    });
  });

  describe('with showfunction false', () => {
    let editor: ConductingEquipmentEditor;
    beforeEach(async () => {
      const subFunc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`ConductingEquipment[name="QA2"]`)!;

      editor = await fixture(
        html`<conducting-equipment-editor
          .element=${subFunc}
        ></conducting-equipment-editor>`,
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
        `conducting-equipment-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: ConductingEquipmentEditor;
    beforeEach(async () => {
      const lNode = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`ConductingEquipment[name="QA2"]`)!;

      editor = await fixture(
        html`<conducting-equipment-editor
          .element=${lNode}
          ?showfunctions=${true}
        ></conducting-equipment-editor>`,
      );
      document.body.style.width = '550';
      document.body.style.height = '950';
      editor.style.position = 'absolute';
      editor.style.top = '20';
      editor.style.left = '20';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 500, height: 950 });

      await sendMouse({ type: 'click', position: [120, 240] });

      await timeout(200);
      await visualDiff(
        document.body,
        `conducting-equipment-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
