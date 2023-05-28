export function numberFormat(number, decimals = 2, dec_point = '.', thousands_sep = ' ', hidingZero = false) {
  // Format a number with grouped thousands
  //
  // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfix by: Michael White (http://crestidg.com)

  var i, j, kw, kd, km;

  // input sanitation
  i = parseInt((number = (+number || 0).toFixed(decimals))) + '';

  if ((j = i.length) > 3) {
    j = j % 3;
  } else {
    j = 0;
  }

  km = j ? i.substr(0, j) + thousands_sep : '';
  kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands_sep);
  //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
  kd = decimals
    ? dec_point +
      Math.abs(number - i)
        .toFixed(decimals)
        .replace(/-/, 0)
        .slice(2)
    : '';

  return km + kw + (hidingZero && kd === '.00' ? '' : kd);
}

export function nl2br(str, is_xhtml) {
  if (typeof str === 'undefined' || str === null) {
    return '';
  }
  var breakTag = is_xhtml || typeof is_xhtml === 'undefined' ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}
