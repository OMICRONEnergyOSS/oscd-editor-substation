import { fixture, html } from '@open-wc/testing';

import { sendMouse, setViewport } from '@web/test-runner-commands';

import { visualDiff } from '@web/test-runner-visual-regression';

import { baseStyle } from './base-visual.js';

import { substationDoc } from '../substation.testfiles.js';

import './l-node-editor.js';
import type { LNodeEditor } from './l-node-editor.js';

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

describe('Component for SCL element LNode', () => {
  describe('highlights the logical node group be main icon', () => {
    [
      'L',
      'A',
      'C',
      'F',
      'G',
      'I',
      'K',
      'M',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'X',
      'Y',
      'Z',
    ].forEach((group, index) => {
      describe(`for logical node group ${group}`, () => {
        let editor: LNodeEditor;
        beforeEach(async () => {
          const lNode = new DOMParser()
            .parseFromString(substationDoc, 'application/xml')
            .querySelector(`LNode[lnClass="${group}xxx"]`)!;

          editor = await fixture(
            html`<l-node-editor .element=${lNode}></l-node-editor>`,
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
          await editor.updateComplete;

          await setViewport({ width: 200, height: 200 });

          await editor.updateComplete;
          await timeout(100);
          await visualDiff(
            document.body,
            `l-node-editor/#${index + 1} ${group}xxx`,
          );
        });
      });
    });
  });

  describe('with invalid l-node-editor', () => {
    let editor: LNodeEditor;
    beforeEach(async () => {
      const lNode = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`LNode:not([lnClass])`)!;

      editor = await fixture(
        html`<l-node-editor .element=${lNode}></l-node-editor>`,
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
      await setViewport({ width: 200, height: 200 });

      await editor.updateComplete;
      await timeout(200);
      await visualDiff(document.body, `l-node-editor/#17 Missing lnClass`);
    });
  });

  describe('with unselected reference to type templates', () => {
    let editor: LNodeEditor;
    beforeEach(async () => {
      const lNode = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`LNode[iedName="None"]`)!;

      editor = await fixture(
        html`<l-node-editor .element=${lNode}></l-node-editor>`,
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

      await timeout(200);
      await visualDiff(
        document.body,
        `l-node-editor/#18 unfocussed DataTypeTemplate reference`,
      );
    });
  });

  describe('with selected reference to type templates', () => {
    let editor: LNodeEditor;
    beforeEach(async () => {
      const lNode = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`LNode[iedName="None"]`)!;

      editor = await fixture(
        html`<l-node-editor .element=${lNode}></l-node-editor>`,
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

      await sendMouse({ type: 'click', position: [120, 120] });

      await timeout(200);
      await visualDiff(
        document.body,
        `l-node-editor/#19 focused DataTypeTemplate reference`,
      );
    });
  });

  describe('with focused l-node-editor', () => {
    let editor: LNodeEditor;
    beforeEach(async () => {
      const lNode = new DOMParser()
        .parseFromString(substationDoc, 'application/xml')
        .querySelector(`LNode`)!;

      editor = await fixture(
        html`<l-node-editor .element=${lNode}></l-node-editor>`,
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

      await sendMouse({ type: 'click', position: [120, 120] });

      await timeout(200);
      await visualDiff(
        document.body,
        `l-node-editor/#20 Focused l-node-editor`,
      );
    });
  });
});
