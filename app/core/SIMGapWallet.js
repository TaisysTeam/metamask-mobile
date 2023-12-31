import { NativeModules, Platform } from 'react-native';
import Logger from '../util/Logger';

// eslint-disable-next-line dot-notation
const METAMASK_ENVIRONMENT = process.env['METAMASK_ENVIRONMENT'];

const isQa = METAMASK_ENVIRONMENT === 'qa';
const isAndroid = Platform.OS === 'android';
const coldWallet = NativeModules.SIMGapWallet;

/*
class SIMGapWallet {
  constructor() {
  }
*/

export default {
  // { address: string; index: number; balance: string }
  async available() {
    Logger.log('Calling SIMGapWallet.available()...');
    if (isAndroid) {
      var rr = await coldWallet.available();
      Logger.log('After Calling SIMGapWallet.available()... rr:' + rr);
      if (rr == 'null') {
        Logger.log('SIMGapWallet.available() got a null response.');
        return null;
      }
      return rr;
    }
  },
  async fetchResult(fid) {
    Logger.log('Calling SIMGapWallet.fetchResult(' + fid + ')...');
    var rr = await coldWallet.fetchResult(fid);
    if (rr == 'null') {
      Logger.log('SIMGapWallet.available() got a null response.');
      return null;
    }

    if (fid == 1) {
      // available
      var accounts = new Array();
      var i;
      var res = rr.split('|');
      Logger.log('    ' + res.length + ' accounts are returned.');
      for (i = 0; i < res.length; i++) {
        Logger.log('    Account-' + i);
        var itm = res[i].split('@');

        const addr = itm[0];
        const idx = parseInt(itm[1], 10);
        const blnc = itm[2];

        Logger.log('       addr: ' + addr);
        Logger.log('       idx: ' + idx);
        Logger.log('       blnc: ' + blnc);

        const acc = { address: addr, index: idx, balance: blnc };
        accounts[i] = acc;
      }
      return accounts;
    } else if (fid == 2) {
      // signTransaction
      let signature = rr;
      const r = signature.slice(0, 32);
      const s = signature.slice(32, 64);
      const v = signature.slice(64);
      return {
        r,
        s,
        v,
      };
    }

    return null;
  },

  async newWallet() {
    Logger.log('Calling SIMGapWallet.newWallet()...');
    var rr = await coldWallet.newWallet();
    if (rr == 'null') return null;
    return rr;
  },

  // transType= 0 Transaction; others: typedTransaction
  async signTransaction(address, transType, messageToSign, chainId) {
    Logger.log(
      'Calling SIMGapWallet.signTransaction(address = ' +
      address +
      ', transType = ' +
      transType +
      ', messageToSign = ' +
      messageToSign +
      ', chainId = ' +
      chainId +
      ')...',
    );
    let signature = await coldWallet.signTransaction(
      address,
      transType,
      messageToSign,
      chainId,
    );
    if (signature == 'null') return null;
    const sig = Buffer.from(signature, 'hex');
    const r = sig.slice(0, 32);
    const s = sig.slice(32, 64);
    const v = sig.slice(64);
    // Logger.log('After calling coldWallet.signTransaction' + r);
    // Logger.log('After calling coldWallet.signTransaction' + s);
    // Logger.log('After calling coldWallet.signTransaction' + v);
    return {
      r,
      s,
      v,
    };
  },

  async signMessage(withAccount, data) {
    Logger.log(
      'Calling SIMGapWallet.signMessage(withAccount = ' +
      withAccount +
      ', data = ' +
      data +
      ')...',
    );
    let signature = await coldWallet.signMessage(withAccount, data);
    if (signature == 'null') return null;
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);
    const v = signature.slice(64);
    return {
      r,
      s,
      v,
    };
  },

  async signPersonalMessage(withAccount, messageHex) {
    Logger.log(
      'Calling SIMGapWallet.signPersonalMessage(withAccount = ' +
      withAccount +
      ', messageHex = ' +
      messageHex +
      ')...',
    );
    let signature = await coldWallet.signPersonalMessage(
      withAccount,
      messageHex,
    );
    if (signature == 'null') return null;
    const r = signature.slice(0, 32);
    const s = signature.slice(32, 64);
    const v = signature.slice(64);
    return {
      r,
      s,
      v,
    };
  },

  async signTypedData(withAccount, typedData) {
    Logger.log(
      'Calling SIMGapWallet.signTypedData(withAccount = ' +
      withAccount +
      ', typedData = ' +
      typedData +
      ')...',
    );
    let rr = await coldWallet.signTypedData(withAccount, typedData);
    if (rr == 'null') {
      Logger.log('SIMGapWallet.signTypedData() got a null response.');
      return null;
    }
    return rr;
  },

  async decryptMessage(withAccount, encryptedData) {
    Logger.log(
      'Calling SIMGapWallet.decryptMessage(withAccount = ' +
      withAccount +
      ', encryptedData = ' +
      encryptedData +
      ')...',
    );
    return await coldWallet.signTypedData(withAccount, encryptedData);
  },

  async getEncryptionPublicKey(withAccount) {
    Logger.log(
      'Calling SIMGapWallet.getEncryptionPublicKey(withAccount = ' +
      withAccount +
      ')...',
    );
    return await coldWallet.getEncryptionPublicKey(withAccount);
  },
};
