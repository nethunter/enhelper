package com.studiosh.enhelper;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;

import com.google.android.gcm.GCMRegistrar;

public class MainActivity extends Activity {
	private final static String TAG = "EnHelper";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		GCMRegistrar.checkDevice(this);
		GCMRegistrar.checkManifest(this);
		final String regId = GCMRegistrar
				.getRegistrationId(this);
		if (regId.equals("")) {
			GCMRegistrar.register(this, GCMIntentService.SENDER_ID);
			regId = GCMRegistrar.getRegistrationId(this);
		} else {
			Log.v(TAG, "Already registered as " + regId);
		}
		
		EditText edit_registation_id = (EditText) findViewById(R.id.edit_registration_id);
		edit_registation_id.setText(regId);
		
		Button btnAdd = (Button) findViewById(R.id.btnAddPhone);
		btnAdd.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				Log.d(TAG, "Button pressed!");
				Log.d(TAG, "Found value ".concat(regId));
				
			   URL url = new URL("http://www.android.com/");
			   HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
			   try {
			     InputStream in = new BufferedInputStream(urlConnection.getInputStream());
			    finally {
			     urlConnection.disconnect();
			   }
				 }
				
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.activity_main, menu);
		return true;
	}

}
