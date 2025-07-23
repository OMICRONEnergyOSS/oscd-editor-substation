import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { baseStyle } from './base-visual.js';

import { substationDoc } from '../substation.testfiles.js';

import './line-editor.js';
import type { LineEditor } from './line-editor.js';

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

describe('Component for SCL element Line ', () => {
  describe('with add menu open', () => {
    let editor: LineEditor;
    beforeEach(async () => {
      const line = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Line[name="testLine1"]`)!;

      editor = await fixture(
        html`<line-editor
          .element=${line}
          ?showfunctions=${true}
        ></line-editor>`,
      );
      document.body.style.width = '300';
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
      await setViewport({ width: 300, height: 500 });
      await sendMouse({ type: 'click', position: [260, 20] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(document.body, `line-editor/#1 add menu visible`);
    });
  });

  describe('with showfunction false', () => {
    let editor: LineEditor;
    beforeEach(async () => {
      const line = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Line[name="testLine2"]`)!;

      editor = await fixture(
        html`<line-editor .element=${line}></line-editor>`,
      );
      document.body.style.width = '800';
      document.body.style.height = '600';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 800, height: 600 });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `line-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: LineEditor;
    beforeEach(async () => {
      const line = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Line[name="testLine3"]`)!;

      editor = await fixture(
        html`<line-editor
          .element=${line}
          ?showfunctions=${true}
        ></line-editor>`,
      );
      document.body.style.width = '800';
      document.body.style.height = '1000';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 800, height: 1000 });

      await timeout(600);
      await visualDiff(
        document.body,
        `line-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
