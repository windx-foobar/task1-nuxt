// https://github.com/RobinHerbots/Inputmask
import Inputmask from 'inputmask/lib/inputmask';
import 'inputmask/lib/extensions/inputmask.numeric.extensions';

Inputmask.extendDefaults({
  rightAlign: false,
  showMaskOnHover: false,
  showMaskOnFocus: false,
});

Inputmask.extendDefinitions({
  я: {
    validator: '[0-9А-я]',
  },
  Я: {
    validator: '[0-9А-я()-]',
  },
  z: {
    validator: '[0-9A-z]',
  },
});

Inputmask.extendAliases({
  int: {
    alias: 'integer',
    groupSeparator: ' ',
    autoGroup: true,
    rightAlign: false,
    allowMinus: false,
    showMaskOnHover: false,
    showMaskOnFocus: false,
  },
  'app-integer': {
    alias: 'integer',
    allowMinus: false,
    rightAlign: false,
    showMaskOnHover: false,
    showMaskOnFocus: false,
  },
  'app-decimal': {
    alias: 'decimal',
    allowMinus: false,
    rightAlign: false,
    showMaskOnHover: false,
    showMaskOnFocus: false,
  },
  money: {
    alias: 'decimal',
    groupSeparator: ' ',
    autoGroup: true,
    digits: 2,
    allowMinus: false,
    rightAlign: false,
    showMaskOnHover: false,
    showMaskOnFocus: false,
  },
  zerohundred: {
    alias: 'integer',
    min: 0,
    max: 100,
    allowMinus: false,
    rightAlign: false,
    showMaskOnHover: false,
    showMaskOnFocus: false,
  },
  mobile: {
    mask: '+7 (\\999) 999-99-99',
  },
  phone: {
    mask: '+7 (999) 999-99-99',
  },
  vin: {
    mask: new Array(17).fill('*').join(''),
    definitions: {
      '*': {
        validator: '[0-9ABCDEFGHJKLMNPRSTUVWXYZabcdefghjklmnprstuvwxyz]',
        casing: 'upper',
      },
    },
  },
  regNum: {
    mask: '* 999 ** 9{2,3}',
    definitions: {
      '*': {
        validator: '[АВЕКМНОРСТУХавекмнорстух]',
        casing: 'upper',
      },
      9: {
        validator: '[0-9]',
        casing: 'upper',
      },
    },
  },
});

export default Inputmask;
