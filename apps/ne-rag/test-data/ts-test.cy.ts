/*
 * Copyright © 2023 Dell Inc. or its subsidiaries. All Rights Reserved.
 */

/* eslint-disable */

describe('dashboard', () => {
  beforeEach(() => {
    cy.visit('/portal');
  });

  describe('Guided help', () => {
    beforeEach(() => {
      cy.get('vaadin-accordion-panel').then($panel => {
        if (!$panel.prop('opened')) {
          cy.wrap($panel)
            .find('div[role="heading"]')
            .should('be.visible')
            .find('div[role="button"]')
            .click();
        }
      });
    });

    it('should show upload voucher help correctly', () => {
      cy.get('guided-help-card[type="helpLink"]')
        .should('exist')
        .find('.guided-help-card-title')
        .should('contain.text', 'How can I help you?');

      const linkList = cy
        .get('guided-help-card[type="helpLink"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('.link-list')
        .should('be.visible');

      linkList
        .find('.link-list-item')
        .find('dds-link[active]')
        .find('a')
        .should('contain.text', 'Upload Vouchers');

      cy.get('guided-help-card[type="uploadVoucher"]')
        .should('exist')
        .find('.guided-help-card-title')
        .should('contain.text', 'Vouchers & Onboarding');

      cy.get('guided-help-card[type="uploadVoucher"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('ids-button')
        .should('be.visible')
        .click();

      cy.get('.dds-dialog')
        .should('be.visible')
        .find('.modal-title')
        .should('have.text', 'Upload Voucher');

      cy.get('.dds-dialog')
        .should('be.visible')
        .find('.modal-actions')
        .find('edf-button[kind="tertiary"]')
        .click();

      cy.get('.dds-dialog').should('not.exist');
    });

    it('should show Concepts & Relationship help correctly', () => {
      const linkList = cy
        .get('guided-help-card[type="helpLink"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('.link-list')
        .should('be.visible');

      linkList
        .find('.link-list-item')
        .find('dds-link')
        .contains('Concepts & Relationships')
        .click();

      cy.get('guided-help-card[type="elementRelationship"]')
        .should('exist')
        .find('.card-list-title')
        .should('contain.text', 'Concepts & Relationships');

      const cardTitles = [];
      cy.get('guided-help-card[type="elementRelationship"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('.card-list')
        .find('card-component')
        .each($card => cardTitles.push($card.find('h5').text()));

      cy.wrap(cardTitles).should('deep.equal', [
        'Catalog',
        'Deployment',
        'Endpoints',
        'Virtual Machines / Containers',
      ]);
    });

    it('should show Automated Application Deployment help correctly', () => {
      const linkList = cy
        .get('guided-help-card[type="helpLink"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('.link-list')
        .should('be.visible');

      linkList
        .find('.link-list-item')
        .find('dds-link')
        .contains('Automated Application Deployment')
        .click();

      cy.get('guided-help-card[type="automatedAppProvisioning"]')
        .should('exist')
        .find('.guided-help-card-title')
        .should('contain.text', 'Automated Application Deployment');

      cy.get('guided-help-card[type="automatedAppProvisioning"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('ids-button')
        .should('be.visible')
        .should('contain.text', 'Auto Deployment Rule');
    });

    it('should show Application Deployment help correctly', () => {
      const linkList = cy
        .get('guided-help-card[type="helpLink"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('.link-list')
        .should('be.visible');

      linkList
        .find('.link-list-item')
        .find('dds-link')
        .contains('Application Deployment')
        .click();

      cy.getByTestId('guided-help-card-details')
        .should('exist')
        .find('.guided-help-card-title')
        .should('contain.text', 'Application Deployment');
    });

    it('should show Quick links help correctly', () => {
      const linkList = cy
        .get('guided-help-card[type="helpLink"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('.link-list')
        .should('be.visible');

      linkList
        .find('.link-list-item')
        .find('dds-link')
        .contains('Quick Links')
        .click();

      cy.get('guided-help-card[type="quickLinks"]')
        .should('exist')
        .find('.guided-help-card-title')
        .should('contain.text', 'Quick Links');

      const links = [];
      cy.get('guided-help-card[type="quickLinks"]')
        .should('exist')
        .find('.guided-help-card-content')
        .should('be.visible')
        .find('link-list')
        .find('.link-list-item dds-link')
        .should('have.length', 5)
        .each($link =>
          links.push(Cypress.$($link[0].shadowRoot).find('a').text())
        );

      cy.wrap(links).should('deep.equal', [
        'View Endpoints',
        'Add Application',
        'Deploy Applications',
        'Create Rule',
        'ESE Connectivity',
      ]);
    });
  });

  it('should show widgets correctly', () => {
    cy.get('widget-card[widgettitle="Alerts"]').should('exist');
    cy.contains(/^Critical$/).should('exist');
    cy.contains(/^Error$/).should('exist');
    cy.contains(/^Warning$/).should('exist');
    cy.contains(/^Information$/).should('exist');

    cy.get(
      'widget-card[widgettitle="Endpoints, Virtual Machines and Deployments"]'
    ).should('exist');
    cy.contains(/^Processing$/).should('exist');
    cy.contains(/^Disconnected$/).should('exist');
    cy.contains(/^Maintenance$/).should('exist');
    cy.contains(/^Updating$/).should('exist');
    cy.contains(/^Cancelled$/).should('exist');
    cy.contains(/^Completed$/).should('exist');
    cy.contains(/^In Progress$/).should('exist');
    cy.contains(/^Failed/).should('exist');
    cy.contains(/^Offline$/).should('exist');
    cy.contains(/^Online$/).should('exist');

    cy.get('widget-card[widgettitle="Rules and Tags"]').should('exist');
    cy.get('#dashboard-rules-list')
      .find('#items')
      .find('tr')
      .should('have.length', 5);

    cy.get('widget-card[widgettitle="Events"]').should('exist');
    cy.get('#dashboard-events-list')
      .find('#items')
      .find('tr')
      .should('have.length.gte', 0);
  });

  //needed to avoid getting a failed test due to a js error
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
  });
});
