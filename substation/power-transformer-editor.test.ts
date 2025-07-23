import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { baseStyle } from './base-visual.js';

import { substationDoc } from '../substation.testfiles.js';

import './power-transformer-editor.js';
import type { PowerTransformerEditor } from './power-transformer-editor.js';

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

describe('Component for SCL element PowerTransformer ', () => {
  describe('with add menu open', () => {
    let editor: PowerTransformerEditor;
    beforeEach(async () => {
      const subFunc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`PowerTransformer[name="PTR2"]`)!;

      editor = await fixture(
        html`<power-transformer-editor
          .element=${subFunc}
          ?showfunctions=${true}
        ></power-transformer-editor>`,
      );
      document.body.style.width = '300';
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
      await setViewport({ width: 300, height: 600 });
      await sendMouse({ type: 'click', position: [260, 20] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `power-transformer-editor/#1 add menu visible`,
      );
    });
  });

  describe('with showfunction false', () => {
    let editor: PowerTransformerEditor;
    beforeEach(async () => {
      const subFunc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`PowerTransformer[name="PTR3"]`)!;

      editor = await fixture(
        html`<power-transformer-editor
          .element=${subFunc}
        ></power-transformer-editor>`,
      );
      document.body.style.width = '300';
      document.body.style.height = '300';
      editor.style.position = 'absolute';
      editor.style.top = '100';
      editor.style.left = '100';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 300, height: 300 });
      await sendMouse({ type: 'click', position: [100, 100] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `power-transformer-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: PowerTransformerEditor;
    beforeEach(async () => {
      const lNode = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`PowerTransformer[name="PTR3"]`)!;

      editor = await fixture(
        html`<power-transformer-editor
          .element=${lNode}
          ?showfunctions=${true}
        ></power-transformer-editor>`,
      );
      document.body.style.width = '400';
      document.body.style.height = '1000';
      editor.style.position = 'absolute';
      editor.style.top = '20';
      editor.style.left = '20';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 400, height: 1000 });

      await sendMouse({ type: 'click', position: [120, 240] });

      await timeout(600);
      await visualDiff(
        document.body,
        `power-transformer-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
