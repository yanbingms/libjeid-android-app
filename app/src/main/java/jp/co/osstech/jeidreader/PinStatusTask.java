package jp.co.osstech.jeidreader;

import android.nfc.Tag;
import android.os.AsyncTask;
import android.util.Log;

import java.lang.ref.WeakReference;

import jp.co.osstech.libjeid.CardInputHelperAP;
import jp.co.osstech.libjeid.CardType;
import jp.co.osstech.libjeid.DriverLicenseAP;
import jp.co.osstech.libjeid.JPKIAP;
import jp.co.osstech.libjeid.JeidReader;

public class PinStatusTask extends AsyncTask<Void, String, Exception>
{
    private static final String TAG = MainActivity.TAG;
    private WeakReference mRef;
    private Tag mNfcTag;
    private ProgressDialogFragment mProgress;

    public PinStatusTask(PinStatusActivity activity, Tag nfcTag) {
        mRef = new WeakReference<PinStatusActivity>(activity);
        mNfcTag = nfcTag;
    }

    @Override
    protected void onPreExecute() {
        PinStatusActivity activity = (PinStatusActivity)mRef.get();
        if (activity == null) {
            return;
        }
        activity.setMessage("");
        mProgress = new ProgressDialogFragment();
        mProgress.show(activity.getSupportFragmentManager(), "progress");
    }

    @Override
    protected Exception doInBackground(Void... args) {
        try {
            JeidReader reader = new JeidReader(mNfcTag);
            int counter;

            CardType type = reader.detectCardType();
            switch (type) {
            case IN:
                publishProgress("カード種別: マイナンバーカード");
                CardInputHelperAP helperAP = reader.selectCardInputHelperAP();
                counter = helperAP.getPin();
                publishProgress("券面入力補助 暗証番号: " + counter);
                counter = helperAP.getPinA();
                publishProgress("券面入力補助 照合番号A: " + counter);
                counter = helperAP.getPinB();
                publishProgress("券面入力補助 照合番号B: " + counter);

                JPKIAP jpkiAP = reader.selectJPKIAP();
                counter = jpkiAP.getAuthPin();
                publishProgress("JPKIユーザー認証PIN: " + counter);
                counter = jpkiAP.getSignPin();
                publishProgress("JPKIデジタル署名PIN: " + counter);
                return null;
            case DL:
                publishProgress("カード種別: 運転免許証");
                DriverLicenseAP dlAP = reader.selectDriverLicenseAP();
                counter = dlAP.getPin1();
                publishProgress("暗証番号1: " + counter);
                counter = dlAP.getPin2();
                publishProgress("暗証番号2: " + counter);
                break;
            case JUKI:
                publishProgress("カード種別: 住基カード");
                break;
            case EP:
                publishProgress("カード種別: パスポート");
                break;
            default:
                publishProgress("カード種別: 不明");
                break;
            }
        } catch (Exception e) {
            Log.e(TAG, "error at " + getClass().getSimpleName(), e);
            return e;
        }
        return null;
    }

    protected void onProgressUpdate(String... values) {
        PinStatusActivity activity = (PinStatusActivity)mRef.get();
        if (activity == null) {
            return;
        }
        activity.addMessage(values[0]);
    }

    @Override
    protected void onPostExecute(Exception e) {
        mProgress.dismiss();
        PinStatusActivity activity = (PinStatusActivity)mRef.get();
        if (activity == null) {
            return;
        }
        if (e != null) {
            activity.addMessage("エラー: " + e);
        }
    }
}
