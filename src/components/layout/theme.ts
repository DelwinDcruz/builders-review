/** Runs before paint: adds `js` (for safe reveal) and applies LIGHT-FIRST theme. */
export const themeInitScript = `
(function(){try{
  var d=document.documentElement; d.classList.add('js');
  var s=localStorage.getItem('theme');
  d.classList.toggle('dark', s==='dark');
}catch(e){}})();
`;
