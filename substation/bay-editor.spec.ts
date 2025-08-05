import { expect, fixture, html } from '@open-wc/testing';

import { SinonSpy, spy } from 'sinon';

import { isRemove } from '@omicronenergy/oscd-api/utils.js';

import { substationDoc } from '../substation.testfiles.js';

import './bay-editor.js';
import type { BayEditor } from './bay-editor.js';

const bay = new DOMParser()
  .parseFromString(substationDoc, 'application/xml')
  .querySelector('Bay[name="testBay1"]')!;

describe('Component for SCL element Bay ', () => {
  let bayEditor: BayEditor;

  let eventSpy: SinonSpy;

  beforeEach(async () => {
    bayEditor = await fixture(
      html`<bay-editor .element="${bay}" ?showfunctions=${true}></bay-editor>`,
    );

    eventSpy = spy();
    window.addEventListener('oscd-edit-v2', eventSpy);
    window.addEventListener('oscd-edit-wizard-request', eventSpy);
    window.addEventListener('oscd-create-wizard-request', eventSpy);
  });

  afterEach(() => {
    window.removeEventListener('oscd-edit-v2', eventSpy);
    window.removeEventListener('oscd-edit-wizard-request', eventSpy);
    window.removeEventListener('oscd-create-wizard-request', eventSpy);
    eventSpy.resetHistory();
  });

  it('sends a wizard edit request', () => {
    bayEditor.editActionable?.click();

    expect(eventSpy.callCount).to.equal(1);

    const event = eventSpy.args[0][0];
    expect(event.type).to.equal('oscd-edit-wizard-request');
    expect(event.detail.element).to.equal(bay);
  });

  it('sends a wizard create request', () => {
    bayEditor.addActionable?.forEach(add => {
      add.click();

      expect(eventSpy.callCount).to.equal(1);

      const event = eventSpy.args[0][0];
      expect(event.type).to.equal('oscd-create-wizard-request');
      expect(event.detail.parent).to.equal(bay);
      expect(event.detail.tagName).to.equal(add.value);

      eventSpy.resetHistory(); // individual select
    });
  });

  it('allows to remove an existing Bay element', () => {
    bayEditor.removeActionable?.click();

    expect(eventSpy.callCount).to.equal(1);

    const event = eventSpy.args[0][0];

    expect(event.type).to.equal('oscd-edit-v2');
    expect(event.detail.edit).to.satisfy(isRemove);
    expect(event.detail.edit.node).to.equal(bay);
  });
});
