import { expect, fixture, html } from '@open-wc/testing';

import { SinonSpy, spy } from 'sinon';

import { isRemove } from '@omicronenergy/oscd-api/utils.js';

import { substationDoc } from '../substation.testfiles.js';

import './tap-changer-editor.js';
import type { TapChangerEditor } from './tap-changer-editor.js';

const tapCh = new DOMParser()
  .parseFromString(substationDoc, 'application/xml')
  .querySelector('TapChanger')!;

describe('Component for SCL element TapChanger', () => {
  let editor: TapChangerEditor;

  let eventSpy: SinonSpy;

  beforeEach(async () => {
    editor = await fixture(
      html`<tap-changer-editor .element="${tapCh}"></tap-changer-editor>`,
    );

    eventSpy = spy();
    window.addEventListener('oscd-edit-v2', eventSpy);
    window.addEventListener('oscd-edit-wizard-request', eventSpy);
    window.addEventListener('oscd-create-wizard-request', eventSpy);
  });

  it('sends a wizard edit request', () => {
    editor.editActionable?.click();

    expect(eventSpy.callCount).to.equal(1);

    const event = eventSpy.args[0][0];
    expect(event.type).to.equal('oscd-edit-wizard-request');
    expect(event.detail.element).to.equal(tapCh);
  });

  it('sends a wizard create request', () => {
    editor.addActionable?.forEach(add => {
      add.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];
      expect(event.type).to.equal('oscd-create-wizard-request');
      expect(event.detail.parent).to.equal(tapCh);
      expect(event.detail.tagName).to.equal(add.value);

      eventSpy.resetHistory(); // individual select
    });
  });

  it('allows to remove an existing TapChanger element', () => {
    editor.removeActionable?.click();

    expect(eventSpy.callCount).to.equal(1);

    const event = eventSpy.args[0][0];

    expect(event.type).to.equal('oscd-edit-v2');
    expect(event.detail.edit).to.satisfy(isRemove);
    expect(event.detail.edit.node).to.equal(tapCh);
  });
});
