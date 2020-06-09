import appSettings from 'appSettings';
import events from 'events';

function onSaveTimeout() {
    var self = this;
    self.saveTimeout = null;
    self.currentApiClient.updateDisplayPreferences('usersettings', self.displayPrefs, self.currentUserId, 'emby');
}

function saveServerPreferences(instance) {
    if (instance.saveTimeout) {
        clearTimeout(instance.saveTimeout);
    }

    instance.saveTimeout = setTimeout(onSaveTimeout.bind(instance), 50);
}

export class UserSettings {
    constructor() {
    }

    /**
     * Bind UserSettings instance to user.
     * @param {string} - User identifier.
     * @param {Object} - ApiClient instance.
     */
    setUserInfo(userId, apiClient) {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.currentUserId = userId;
        this.currentApiClient = apiClient;

        if (!userId) {
            this.displayPrefs = null;
            return Promise.resolve();
        }

        var self = this;

        return apiClient.getDisplayPreferences('usersettings', userId, 'emby').then(function (result) {
            result.CustomPrefs = result.CustomPrefs || {};
            self.displayPrefs = result;
        });
    }

    // FIXME: Seems unused
    getData() {
        return this.displayPrefs;
    }

    // FIXME: Seems unused
    importFrom(instance) {
        this.displayPrefs = instance.getData();
    }

    // FIXME: 'appSettings.set' doesn't return any value
    /**
     * Set value of setting.
     * @param {string} name - Name of setting.
     * @param {mixed} value - Value of setting.
     * @param {boolean} enableOnServer - Flag to save preferences on server.
     */
    set(name, value, enableOnServer) {
        var userId = this.currentUserId;
        var currentValue = this.get(name, enableOnServer);
        var result = appSettings.set(name, value, userId);

        if (enableOnServer !== false && this.displayPrefs) {
            this.displayPrefs.CustomPrefs[name] = value == null ? value : value.toString();
            saveServerPreferences(this);
        }

        if (currentValue !== value) {
            events.trigger(this, 'change', [name]);
        }

        return result;
    }

    /**
     * Get value of setting.
     * @param {string} name - Name of setting.
     * @param {boolean} enableOnServer - Flag to return preferences from server (cached).
     * @return {string} Value of setting.
     */
    get(name, enableOnServer) {
        var userId = this.currentUserId;
        if (enableOnServer !== false && this.displayPrefs) {
            return this.displayPrefs.CustomPrefs[name];
        }

        return appSettings.get(name, userId);
    }

    /**
     * Get or set user config.
     * @param {Object|undefined} config - Configuration or undefined.
     * @return {Object|Promise} Configuration or Promise.
     */
    serverConfig(config) {
        var apiClient = this.currentApiClient;
        if (config) {
            return apiClient.updateUserConfiguration(this.currentUserId, config);
        }

        return apiClient.getUser(this.currentUserId).then(function (user) {
            return user.Configuration;
        });
    }

    /**
     * Get or set 'Cinema Mode' state.
     * @param {boolean|undefined} val - Flag to enable 'Cinema Mode' or undefined.
     * @return {boolean} 'Cinema Mode' state.
     */
    enableCinemaMode(val) {
        if (val !== undefined) {
            return this.set('enableCinemaMode', val.toString(), false);
        }

        val = this.get('enableCinemaMode', false);
        return val !== 'false';
    }

    /**
     * Get or set 'Next Video Info Overlay' state.
     * @param {boolean|undefined} val - Flag to enable 'Next Video Info Overlay' or undefined.
     * @return {boolean} 'Next Video Info Overlay' state.
     */
    enableNextVideoInfoOverlay(val) {
        if (val !== undefined) {
            return this.set('enableNextVideoInfoOverlay', val.toString());
        }

        val = this.get('enableNextVideoInfoOverlay', false);
        return val !== 'false';
    }

    /**
     * Get or set 'Theme Songs' state.
     * @param {boolean|undefined} val - Flag to enable 'Theme Songs' or undefined.
     * @return {boolean} 'Theme Songs' state.
     */
    enableThemeSongs(val) {
        if (val !== undefined) {
            return this.set('enableThemeSongs', val.toString(), false);
        }

        val = this.get('enableThemeSongs', false);
        return val === 'true';
    }

    /**
     * Get or set 'Theme Videos' state.
     * @param {boolean|undefined} val - Flag to enable 'Theme Videos' or undefined.
     * @return {boolean} 'Theme Videos' state.
     */
    enableThemeVideos(val) {
        if (val !== undefined) {
            return this.set('enableThemeVideos', val.toString(), false);
        }

        val = this.get('enableThemeVideos', false);
        return val === 'true';
    }

    /**
     * Get or set 'Fast Fade-in' state.
     * @param {boolean|undefined} val - Flag to enable 'Fast Fade-in' or undefined.
     * @return {boolean} 'Fast Fade-in' state.
     */
    enableFastFadein(val) {
        if (val !== undefined) {
            return this.set('fastFadein', val.toString(), false);
        }

        val = this.get('fastFadein', false);
        return val !== 'false';
    }

    /**
     * Get or set 'Blurhash' state.
     * @param {boolean|undefined} val - Flag to enable 'Blurhash' or undefined.
     * @return {boolean} 'Blurhash' state.
     */
    enableBlurhash(val) {
        if (val !== undefined) {
            return this.set('blurhash', val.toString(), false);
        }

        val = this.get('blurhash', false);
        return val !== 'false';
    }

    /**
     * Get or set 'hoverZoom' state.
     * @param {boolean|undefined} val - Flag to enable 'hoverZoom' or undefined.
     * @return {boolean} 'hoverZoom' state.
     */
    enableHoverZoom(val) {
        if (val !== undefined) {
            return this.set('hoverZoom', val.toString(), false);
        }

        val = this.get('hoverZoom', false);
        return val !== 'false';
    }

    /**
     * Get or set 'hoverBlur' state.
     * @param {boolean|undefined} val - Flag to enable 'hoverBlur' or undefined.
     * @return {boolean} 'hoverBlur' state.
     */
    enableHoverBlur(val) {
        if (val !== undefined) {
            return this.set('hoverBlur', val.toString(), false);
        }

        val = this.get('hoverBlur', false);
        return val !== 'false';
    }

    /**
     * Get or set 'hoverDarkening' state.
     * @param {boolean|undefined} val - Flag to enable 'hoverDarkening' or undefined.
     * @return {boolean} 'hoverDarkening' state.
     */
    enableHoverDarkening(val) {
        if (val !== undefined) {
            return this.set('hoverDarkening', val.toString(), false);
        }

        val = this.get('hoverDarkening', false);
        return val !== 'false';
    }

    /**
     * Get or set 'Backdrops' state.
     * @param {boolean|undefined} val - Flag to enable 'Backdrops' or undefined.
     * @return {boolean} 'Backdrops' state.
     */
    enableBackdrops(val) {
        if (val !== undefined) {
            return this.set('enableBackdrops', val.toString(), false);
        }

        val = this.get('enableBackdrops', false);
        return val !== 'false';
    }

    /**
     * Get or set 'Details Banner' state.
     * @param {boolean|undefined} val - Flag to enable 'Details Banner' or undefined.
     * @return {boolean} 'Details Banner' state.
     */
    detailsBanner(val) {
        if (val !== undefined) {
            return this.set('detailsBanner', val.toString(), false);
        }

        val = this.get('detailsBanner', false);
        return val !== 'false';
    }

    /**
     * Get or set language.
     * @param {string|undefined} val - Language.
     * @return {string} Language.
     */
    language(val) {
        if (val !== undefined) {
            return this.set('language', val.toString(), false);
        }

        return this.get('language', false);
    }

    /**
     * Get or set datetime locale.
     * @param {string|undefined} val - Datetime locale.
     * @return {string} Datetime locale.
     */
    dateTimeLocale(val) {
        if (val !== undefined) {
            return this.set('datetimelocale', val.toString(), false);
        }

        return this.get('datetimelocale', false);
    }

    /**
     * Get or set Chromecast version.
     * @param {string|undefined} val - Chromecast version.
     * @return {string} Chromecast version.
     */
    chromecastVersion(val) {
        if (val !== undefined) {
            return this.set('chromecastVersion', val.toString());
        }

        return this.get('chromecastVersion') || 'stable';
    }

    /**
     * Get or set amount of rewind.
     * @param {number|undefined} val - Amount of rewind.
     * @return {number} Amount of rewind.
     */
    skipBackLength(val) {
        if (val !== undefined) {
            return this.set('skipBackLength', val.toString());
        }

        return parseInt(this.get('skipBackLength') || '10000');
    }

    /**
     * Get or set amount of fast forward.
     * @param {number|undefined} val - Amount of fast forward.
     * @return {number} Amount of fast forward.
     */
    skipForwardLength(val) {
        if (val !== undefined) {
            return this.set('skipForwardLength', val.toString());
        }

        return parseInt(this.get('skipForwardLength') || '30000');
    }

    /**
     * Get or set theme for Dashboard.
     * @param {string|undefined} val - Theme for Dashboard.
     * @return {string} Theme for Dashboard.
     */
    dashboardTheme(val) {
        if (val !== undefined) {
            return this.set('dashboardTheme', val);
        }

        return this.get('dashboardTheme');
    }

    /**
     * Get or set skin.
     * @param {string|undefined} val - Skin.
     * @return {string} Skin.
     */
    skin(val) {
        if (val !== undefined) {
            return this.set('skin', val, false);
        }

        return this.get('skin', false);
    }

    /**
     * Get or set main theme.
     * @param {string|undefined} val - Main theme.
     * @return {string} Main theme.
     */
    theme(val) {
        if (val !== undefined) {
            return this.set('appTheme', val, false);
        }

        return this.get('appTheme', false);
    }

    /**
     * Get or set screensaver.
     * @param {string|undefined} val - Screensaver.
     * @return {string} Screensaver.
     */
    screensaver(val) {
        if (val !== undefined) {
            return this.set('screensaver', val, false);
        }

        return this.get('screensaver', false);
    }

    /**
     * Get or set library page size.
     * @param {number|undefined} val - Library page size.
     * @return {number} Library page size.
     */
    libraryPageSize(val) {
        if (val !== undefined) {
            return this.set('libraryPageSize', parseInt(val, 10), false);
        }

        var libraryPageSize = parseInt(this.get('libraryPageSize', false), 10);
        if (libraryPageSize === 0) {
            // Explicitly return 0 to avoid returning 100 because 0 is falsy.
            return 0;
        } else {
            return libraryPageSize || 100;
        }
    }

    /**
     * Get or set sound effects.
     * @param {string|undefined} val - Sound effects.
     * @return {string} Sound effects.
     */
    soundEffects(val) {
        if (val !== undefined) {
            return this.set('soundeffects', val, false);
        }

        return this.get('soundeffects', false);
    }

    /**
     * Load query settings.
     * @param {string} key - Query key.
     * @param {Object} query - Query base.
     * @return {Object} Query.
     */
    loadQuerySettings(key, query) {
        var values = this.get(key);
        if (values) {
            values = JSON.parse(values);
            return Object.assign(query, values);
        }

        return query;
    }

    /**
     * Save query settings.
     * @param {string} key - Query key.
     * @param {Object} query - Query.
     */
    saveQuerySettings(key, query) {
        var values = {};
        if (query.SortBy) {
            values.SortBy = query.SortBy;
        }

        if (query.SortOrder) {
            values.SortOrder = query.SortOrder;
        }

        return this.set(key, JSON.stringify(values));
    }

    /**
     * Get subtitle appearance settings.
     * @param {string|undefined} key - Settings key.
     * @return {Object} Subtitle appearance settings.
     */
    getSubtitleAppearanceSettings(key) {
        key = key || 'localplayersubtitleappearance3';
        return JSON.parse(this.get(key, false) || '{}');
    }

    /**
     * Set subtitle appearance settings.
     * @param {Object} value - Subtitle appearance settings.
     * @param {string|undefined} key - Settings key.
     */
    setSubtitleAppearanceSettings(value, key) {
        key = key || 'localplayersubtitleappearance3';
        return this.set(key, JSON.stringify(value), false);
    }

    /**
     * Set filter.
     * @param {string} key - Filter key.
     * @param {string} value - Filter value.
     */
    setFilter(key, value) {
        return this.set(key, value, true);
    }

    /**
     * Get filter.
     * @param {string} key - Filter key.
     * @return {string} Filter value.
     */
    getFilter(key) {
        return this.get(key, true);
    }
}

export const currentSettings = new UserSettings;

// Wrappers for non-ES6 modules and backward compatibility
export const setUserInfo = currentSettings.setUserInfo.bind(currentSettings);
export const getData = currentSettings.getData.bind(currentSettings);
export const importFrom = currentSettings.importFrom.bind(currentSettings);
export const set = currentSettings.set.bind(currentSettings);
export const get = currentSettings.get.bind(currentSettings);
export const serverConfig = currentSettings.serverConfig.bind(currentSettings);
export const enableCinemaMode = currentSettings.enableCinemaMode.bind(currentSettings);
export const enableNextVideoInfoOverlay = currentSettings.enableNextVideoInfoOverlay.bind(currentSettings);
export const enableThemeSongs = currentSettings.enableThemeSongs.bind(currentSettings);
export const enableThemeVideos = currentSettings.enableThemeVideos.bind(currentSettings);
export const enableFastFadein = currentSettings.enableFastFadein.bind(currentSettings);
export const enableBlurhash = currentSettings.enableBlurhash.bind(currentSettings);
export const enableHoverZoom = currentSettings.enableHoverZoom.bind(currentSettings);
export const enableHoverBlur = currentSettings.enableHoverBlur.bind(currentSettings);
export const enableHoverDarkening = currentSettings.enableHoverDarkening.bind(currentSettings);
export const enableBackdrops = currentSettings.enableBackdrops.bind(currentSettings);
export const detailsBanner = currentSettings.detailsBanner.bind(currentSettings);
export const language = currentSettings.language.bind(currentSettings);
export const dateTimeLocale = currentSettings.dateTimeLocale.bind(currentSettings);
export const chromecastVersion = currentSettings.chromecastVersion.bind(currentSettings);
export const skipBackLength = currentSettings.skipBackLength.bind(currentSettings);
export const skipForwardLength = currentSettings.skipForwardLength.bind(currentSettings);
export const dashboardTheme = currentSettings.dashboardTheme.bind(currentSettings);
export const skin = currentSettings.skin.bind(currentSettings);
export const theme = currentSettings.theme.bind(currentSettings);
export const screensaver = currentSettings.screensaver.bind(currentSettings);
export const libraryPageSize = currentSettings.libraryPageSize.bind(currentSettings);
export const soundEffects = currentSettings.soundEffects.bind(currentSettings);
export const loadQuerySettings = currentSettings.loadQuerySettings.bind(currentSettings);
export const saveQuerySettings = currentSettings.saveQuerySettings.bind(currentSettings);
export const getSubtitleAppearanceSettings = currentSettings.getSubtitleAppearanceSettings.bind(currentSettings);
export const setSubtitleAppearanceSettings = currentSettings.setSubtitleAppearanceSettings.bind(currentSettings);
export const setFilter = currentSettings.setFilter.bind(currentSettings);
export const getFilter = currentSettings.getFilter.bind(currentSettings);
