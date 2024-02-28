/* eslint-disable @typescript-eslint/restrict-plus-operands */
import * as React from 'react';
import QRCode from 'qrcode';
import { download } from '@/utils/tools';
import { useUpdateEffect } from 'ahooks';

export interface IShareData {
  symbol: string;
  inviteCode: string;
  side: 'Long' | 'Short';
  leverage: string;
  urPnlRate: string;
  urPnl: string;
  entryPrice: string;
  markPrice: string;
  direction: 'up' | 'down';
}

interface IShare extends IShareData {
  showAmount?: boolean;
  shareWay: 0 | 1; // 0 vertical 1 horizontal
  locale?: string;
}

const CANVAS_TEXTS = {
  'en-US': {
    price1: 'Entry Price' as const,
    price2: 'Mark Price' as const,
    code: 'Referral Code' as const,
    scan: 'Scan the QR code and welcome to TruBit Pro!' as const,
  },
  'pt-PT': {
    price1: 'Preço de Entrada' as const,
    price2: 'Preço de Referência' as const,
    code: 'Código de Indicação' as const,
    scan: 'Leia o código QR e bem-vindo ao TruBit Pro!' as const,
  },
  'es-ES': {
    price1: 'Precio de Entrada' as const,
    price2: 'Precio de Marca' as const,
    code: 'Código de Referido' as const,
    scan: 'Escanea el código QR y bienvenido a TruBit Pro!' as const,
  },
};

const CANVAS_SIDES = {
  'en-US': {
    Long: 'Long' as const,
    Short: 'Short' as const,
  },
  'pt-PT': {
    Long: 'Longa' as const,
    Short: 'Curta' as const,
  },
  'es-ES': {
    Long: 'Largo' as const,
    Short: 'Corto' as const,
  },
};

// 436 * 466
const CANVAS_WIDTH = 1744;
const CANVAS_HEIGHT = 1864;

// 644 * 410
const RECTANGLE_WIDTH = 2576;
const RECTANGLE_HEIGHT = 1640;

const loadImage = (url: string): Promise<CanvasImageSource> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = url;
  });

const loadQRCode = async (code: string) => {
  const option = {
    // errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 288,
    margin: 2.6,
  };

  const base64 = await QRCode.toDataURL(code, option);
  const qrCode = await loadImage(base64);

  const canvas = window.document.createElement('canvas');
  canvas.width = 288;
  canvas.height = 288;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  drawRoundedRect(ctx, 0, 0, 288, 288, 14);
  ctx.clip();
  ctx.drawImage(qrCode, 0, 0, 288, 288);

  const yyy = canvas.toDataURL();
  return yyy;
  // return qrCode;
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = `${line} ${words[n]} `;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trimEnd().trimStart(), x, y);
      line = `${words[n]} `;
      // eslint-disable-next-line no-param-reassign
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

function drawRoundedRect(cxt, x, y, width, height, radius) {
  cxt.beginPath();
  cxt.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
  cxt.lineTo(width - radius + x, y);
  cxt.arc(width - radius + x, radius + y, radius, (Math.PI * 3) / 2, Math.PI * 2);
  cxt.lineTo(width + x, height + y - radius);
  cxt.arc(width - radius + x, height - radius + y, radius, 0, (Math.PI * 1) / 2);
  cxt.lineTo(radius + x, height + y);
  cxt.arc(radius + x, height - radius + y, radius, (Math.PI * 1) / 2, Math.PI);
  cxt.closePath();
}

function usePoster(): [string, (params: IShare) => void, () => void] {
  const [preview, setPreview] = React.useState<string>('');
  const [type, setType] = React.useState<number>(0);
  const [downloadBlob, setDownloadBlob] = React.useState<Blob>(new Blob());

  const drawSquare = React.useCallback(async (params: IShare) => {
    const {
      locale,
      side,
      leverage,
      symbol,
      direction,
      urPnlRate,
      showAmount,
      urPnl,
      entryPrice,
      markPrice,
      inviteCode,
    } = params;

    const text = CANVAS_TEXTS[locale || 'en-US'];
    const sideText = CANVAS_SIDES[locale || 'en-US'][side];

    // create canvas
    const canvas = window.document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const backImg = await loadImage(require('@/assets/images/contract/share_backdrop.png'));
    ctx.drawImage(backImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.font = '500 64px TrubitPlex';
    ctx.fillStyle = side === 'Long' ? '#00ba6c' : '#e65d75';
    ctx.fillText(sideText, 136, 420);
    const aaa = ctx.measureText(sideText).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(136 + aaa + 48, 372, 4, 52);

    ctx.font = '500 64px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`${leverage}x`, 136 + aaa + 48 + 48, 420);
    const bbb = ctx.measureText(`${leverage}x`).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(136 + aaa + 48 + 48 + bbb + 48, 372, 4, 52);

    ctx.font = '500 64px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(symbol, 136 + aaa + 48 + 48 + bbb + 48 + 48, 420);

    ctx.font = '600 152px TrubitPlex';
    ctx.fillStyle = direction === 'up' ? '#00ba6c' : '#e65d75';
    ctx.fillText(`${direction === 'up' ? '+' : ''}${urPnlRate}%`, 136, 720);

    if (showAmount) {
      ctx.font = '500 64px TrubitPlex';
      ctx.fillStyle = direction === 'up' ? '#00ba6c' : '#e65d75';
      ctx.fillText(`(${direction === 'up' ? '+' : ''}${urPnl})`, 136, 840);
    }

    // ----------------------------------------
    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text.price1, 136, 1080);
    const ccc = ctx.measureText(text.price1).width;

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text.price2, 136, 1180);
    const ddd = ctx.measureText(text.price2).width;

    const maxPrice = Math.max(ccc, ddd);

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(entryPrice, maxPrice + 136 + 68, 1080);

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(markPrice, maxPrice + 136 + 68, 1180);
    // ----------------------------------------

    const upImg = await loadImage(require('@/assets/images/contract/share_up.png'));
    const downImg = await loadImage(require('@/assets/images/contract/share_down.png'));
    ctx.drawImage(direction === 'up' ? upImg : downImg, 912, 344, 768, 928);

    // qrCode
    const qrCodeImg = await loadQRCode(
      `https://www.trubit.com/pro/m/signup/${inviteCode}?language=${locale || 'en-US'}`,
    );

    const qrCode = await loadImage(qrCodeImg);
    ctx.drawImage(qrCode, 136, 1476, 288, 288);

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text.code, 136 + 288 + 72, 1526);

    ctx.font = '600 88px TrubitPlex';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(inviteCode, 136 + 288 + 72, 1656);

    ctx.font = '400 48px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text.scan, 136 + 288 + 72, 1756);

    // toBlob
    canvas.toBlob((blob: Blob) => {
      setDownloadBlob(blob);
      const link = URL.createObjectURL(blob);
      setPreview(link);
    });
  }, []);

  const drawRectangle = React.useCallback(async (params: IShare) => {
    const {
      locale,
      side,
      leverage,
      symbol,
      direction,
      urPnlRate,
      showAmount,
      urPnl,
      entryPrice,
      markPrice,
      inviteCode,
    } = params;

    const text = CANVAS_TEXTS[locale || 'en-US'];
    const sideText = CANVAS_SIDES[locale || 'en-US'][side];

    // create canvas
    const canvas = window.document.createElement('canvas');
    canvas.width = RECTANGLE_WIDTH;
    canvas.height = RECTANGLE_HEIGHT;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const backImg = await loadImage(require('@/assets/images/contract/share_rectangle_bg.png'));
    ctx.drawImage(backImg, 0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT);

    ctx.font = '500 64px TrubitPlex';
    ctx.fillStyle = side === 'Long' ? '#00ba6c' : '#e65d75';
    ctx.fillText(sideText, 136, 410);
    const aaa = ctx.measureText(sideText).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(136 + aaa + 48, 360, 4, 56);

    ctx.font = '500 64px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`${leverage}x`, 136 + aaa + 48 + 48, 410);
    const bbb = ctx.measureText(`${leverage}x`).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(136 + aaa + 48 + 48 + bbb + 48, 360, 4, 56);

    ctx.font = '500 64px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(symbol, 136 + aaa + 48 + 48 + bbb + 48 + 48, 410);

    ctx.font = '600 152px TrubitPlex';
    ctx.fillStyle = direction === 'up' ? '#00ba6c' : '#e65d75';
    ctx.fillText(`${direction === 'up' ? '+' : ''}${urPnlRate}%`, 136, 700);

    if (showAmount) {
      ctx.font = '500 64px TrubitPlex';
      ctx.fillStyle = direction === 'up' ? '#00ba6c' : '#e65d75';
      ctx.fillText(`(${direction === 'up' ? '+' : ''}${urPnl})`, 136, 820);
    }

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text.price1, 136, 1060);

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(entryPrice, 136, 1160);

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text.price2, 650, 1060);

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(markPrice, 650, 1160);

    const upImg = await loadImage(require('@/assets/images/contract/share_up.png'));
    const downImg = await loadImage(require('@/assets/images/contract/share_down.png'));
    ctx.drawImage(direction === 'up' ? upImg : downImg, 1400, 90, 768 * 1.25, 928 * 1.25);

    // qrCode
    const qrCodeImg = await loadQRCode(
      `https://www.baidu.com/pro/m/signup/${inviteCode}?language=${locale || 'en-US'}`,
    );

    const qrCode = await loadImage(qrCodeImg);
    ctx.drawImage(qrCode, 136, 1340, 240, 240);

    ctx.font = '500 56px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(text.code, 1650, 1480);
    const ddd = ctx.measureText(text.code).width;

    ctx.font = '600 70px TrubitPlex';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(inviteCode, 1650 + ddd + 60, 1480);

    ctx.font = '400 50px TrubitPlex';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    wrapText(ctx, text.scan, 420, 1500, 600, 64);

    // toBlob
    canvas.toBlob((blob: Blob) => {
      setDownloadBlob(blob);
      const link = URL.createObjectURL(blob);
      setPreview(link);
    });
  }, []);

  const resetPoster = React.useCallback(
    (params: IShare) => {
      setType(params.shareWay);
      params.shareWay === 0 ? drawSquare(params) : drawRectangle(params);
    },
    [drawRectangle, drawSquare],
  );

  useUpdateEffect(() => {
    setPreview('');
  }, [type]);

  const downloadPoster = React.useCallback(() => {
    download('Poster.png', downloadBlob);
  }, [downloadBlob]);

  return [preview, resetPoster, downloadPoster];
}

export default usePoster;
