package com.studiosh.enhelper;

import android.annotation.TargetApi;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gcm.GCMBaseIntentService;

public class GCMIntentService extends GCMBaseIntentService {
	private static final String TAG = "GCMIntentService";
	public final static String SENDER_ID = "525059126555";
	
	public GCMIntentService() {
		super(SENDER_ID);
	}

	@Override
	protected void onRegistered(Context context, String regId) {
		Log.d(TAG, "Registered as " + regId);
	}
	
	@Override
	protected void onError(Context context, String errorId) {
		Log.d(TAG, "Error on " + errorId);
	}

	@Override
	protected void onMessage(Context context, Intent intent) {
	    String action = intent.getAction();
	    Log.w("C2DM", "Message Receiver called");
	    if ("com.google.android.c2dm.intent.RECEIVE".equals(action)) {
	      Log.w("C2DM", "Received message");
	      final String app = intent.getStringExtra("app");
	      
	      if ("waze".equals(app)) {
		      final String coord = intent.getStringExtra("coord");
		      if (coord == null) {
			      final String name = intent.getStringExtra("name");
			      navigateWithWazeByName(name);
		      } else {
		    	  navigateWithWazeByCoord(coord);
		      }
	      } else if ("call".equals(app)) {
		      final String number = intent.getStringExtra("number");
	    	  callNumber(number);
	      } else if ("copy".equals(app)) {
	    	  final String clipboard = intent.getStringExtra("clipboard");
	    	  copyToClipboard(clipboard);
	      } else if ("open".equals(app)) {
		      final String url = intent.getStringExtra("url");
	    	  openBasicUrl(url);
	      }
	    }		
	}

	@TargetApi(Build.VERSION_CODES.HONEYCOMB)
	private void copyToCliboardHC(String clipboardData) {
		ClipboardManager clipboard = (ClipboardManager)
		        getSystemService(Context.CLIPBOARD_SERVICE);
		ClipData clip = ClipData.newPlainText("simple text", clipboardData);
		clipboard.setPrimaryClip(clip);		
	}
	
    @SuppressWarnings("deprecation")	
	private void copyToCliboardPreHC(String clipboardData) {
		android.text.ClipboardManager clipboard = (android.text.ClipboardManager) 
	    		getSystemService(Context.CLIPBOARD_SERVICE);
	    clipboard.setText(clipboardData);		
	}

	private void copyToClipboard(String clipboardData) {
	    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
	    	copyToCliboardHC(clipboardData);
	    } else {
	    	copyToCliboardPreHC(clipboardData);
	    }
	    
	    Toast.makeText(getApplicationContext(), "Text copied to clipboard", Toast.LENGTH_LONG).show();
	}
	
	private void callNumber(String number) {
		try {
			Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + number));
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			startActivity(intent);
		} catch (ActivityNotFoundException ex) {
			ex.printStackTrace();
		}
	}	

	private void openBasicUrl(String url) {
		try {
			Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			startActivity(intent);
		} catch (ActivityNotFoundException ex) {
			ex.printStackTrace();
		}
	}
	
	private void navigateWithWazeByName(String name) {
		navigateWithWaze("waze://?q=" + name);
	}

	private void navigateWithWazeByCoord(String coord) {
		navigateWithWaze("waze://?ll=" + coord + "&z=10");
	}

	private void navigateWithWaze(String url) {
		try {
			Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			startActivity(intent);
		} catch (ActivityNotFoundException ex) {
			Intent intent = new Intent(Intent.ACTION_VIEW,
					Uri.parse("market://details?id=com.waze"));
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			startActivity(intent);
		}
	}	
	
	@Override
	protected void onUnregistered(Context context, String regId) {	
		Log.d(TAG, "Unregistered as " + regId);		
	}
}
