import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { baseStyle } from './base-visual.js';

import { substationDoc } from '../substation.testfiles.js';

import './process-editor.js';
import type { ProcessEditor } from './process-editor.js';

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

describe('Component for SCL element Process ', () => {
  describe('with add menu open', () => {
    let editor: ProcessEditor;
    beforeEach(async () => {
      const proc = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Process[name="proc1"]`)!;

      editor = await fixture(
        html`<process-editor
          .element=${proc}
          ?showfunctions=${true}
        ></process-editor>`,
      );
      document.body.style.width = '270';
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
      await setViewport({ width: 270, height: 500 });
      await sendMouse({ type: 'click', position: [230, 20] });

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(document.body, `process-editor/#1 add menu visible`);
    });
  });

  describe('with showfunction false', () => {
    let editor: ProcessEditor;
    beforeEach(async () => {
      const line = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Process[name="proc2"]`)!;

      editor = await fixture(
        html`<process-editor .element=${line}></process-editor>`,
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

      await editor.updateComplete;
      await timeout(600);
      await visualDiff(
        document.body,
        `process-editor/#2 Unfocused with showfunction=false`,
      );
    });
  });

  describe('with showfunction true', () => {
    let editor: ProcessEditor;
    beforeEach(async () => {
      const line = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`Process[name="proc2"]`)!;

      editor = await fixture(
        html`<process-editor
          .element=${line}
          ?showfunctions=${true}
        ></process-editor>`,
      );
      document.body.style.width = '800';
      document.body.style.height = '1400';
      document.body.prepend(editor);
    });

    afterEach(async () => {
      editor.remove();
    });

    it('looks like the latest snapshot', async () => {
      await setViewport({ width: 800, height: 1400 });

      await timeout(600);
      await visualDiff(
        document.body,
        `process-editor/#3 Focused with showfunction=true`,
      );
    });
  });
});
