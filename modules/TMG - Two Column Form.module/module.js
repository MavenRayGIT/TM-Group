(function () {
  function placeRecaptchaAfterSubmit(form) {
    if (!form) return;

    var submit = form.querySelector('.hs_submit');
    var recaptcha = form.querySelector('.hs_recaptcha, .hs-recaptcha');

    if (!submit || !recaptcha) return;
    if (submit.nextElementSibling === recaptcha) return;

    submit.insertAdjacentElement('afterend', recaptcha);
  }

  function normalizeTwoColumnForms(root) {
    var scope = root || document;
    var forms = scope.querySelectorAll('.tmg_two_column-form_wrapper form');

    forms.forEach(placeRecaptchaAfterSubmit);
  }

  function init() {
    normalizeTwoColumnForms(document);

    var observer = new MutationObserver(function () {
      normalizeTwoColumnForms(document);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Avoid a persistent full-document observer.
    window.setTimeout(function () {
      observer.disconnect();
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
