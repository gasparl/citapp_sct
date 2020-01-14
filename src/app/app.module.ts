import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Clipboard } from '@ionic-native/clipboard';
import { BackgroundMode } from '@ionic-native/background-mode';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { IonicStorageModule } from '@ionic/storage';
import { EmailComposer } from '@ionic-native/email-composer/';
import { File } from '@ionic-native/file';
import { Network } from '@ionic-native/network';
import { NavigationBar } from '@ionic-native/navigation-bar';
import { Insomnia } from '@ionic-native/insomnia';
import { HttpClientModule } from '@angular/common/http';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { DataShareProvider } from '../providers/data-share/data-share';
import { CitProvider } from '../providers/cit/cit';
import { TranslationProvider } from '../providers/translations/translations';
import { ItemgenProvider } from '../providers/itemgen/itemgen';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { scrollPadding: false, statusbarPadding: false }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    NavigationBar,
    Insomnia,
    Network,
    SplashScreen,
    Clipboard,
    BackgroundMode,
    EmailComposer,
    ScreenOrientation,
    File,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataShareProvider,
    CitProvider,
    TranslationProvider,
    ItemgenProvider
  ]
})
export class AppModule { }
