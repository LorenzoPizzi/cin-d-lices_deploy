
document.addEventListener('DOMContentLoaded', () => {
    const userId = document.body.dataset.userid;
  
   
    document.addEventListener('click', async (e) => {
      const editBtn = e.target.closest('.edit-btn');
      if (!editBtn) return;
  
      const field = editBtn.dataset.field;
      const span  = document.querySelector(`.editable[data-field="${field}"]`);
      if (!span) return;
  
      const initial = span.textContent.trim();
      const input   = field === 'description'
        ? document.createElement('textarea')
        : document.createElement('input');
  
      input.value = initial;
      input.className = 'inline-input';
      span.replaceWith(input);
      input.focus();
  
     
      const save = document.createElement('button');
      save.textContent = '💾';
      save.className = 'save-btn';
      editBtn.after(save);
  
      
      save.addEventListener('click', () => send());
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') rollback();
        if (ev.key === 'Enter' && field !== 'description') send();
      });
  
      async function send() {
        const value = input.value.trim();
        if (value === initial) return rollback();
  
        try {
          const res = await fetch(`/profiles/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: value })
          });
          if (!res.ok) throw new Error(await res.text());
          rollback(value);         
        } catch (err) {
          alert(`Erreur : ${err.message}`);
          rollback();               
        }
      }
  
      function rollback(text = initial) {
        const spanBack = document.createElement('span');
        spanBack.className = 'editable';
        spanBack.dataset.field = field;
        spanBack.textContent = text;
        input.replaceWith(spanBack);
        save.remove();
      }
    });
  });
  