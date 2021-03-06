package jp.co.osstech.jeidreader;

import android.app.AlertDialog;
import android.app.Dialog;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.view.View;

public class ProgressDialogFragment extends DialogFragment {

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        setCancelable(false);
        View view = getActivity()
            .getLayoutInflater()
            .inflate(R.layout.progress_dialog, null);
        return new AlertDialog.Builder(getActivity())
            .setTitle("読み取り中")
            .setMessage("カードを離さないでください")
            .setView(view)
            .create();
    }
}
