/*!
    @e53e04ac/ipp5-backend-idp-builder/index.mjs
    Copyright (C) @e53e04ac
    MIT License
*/

import { AzureTerraformer } from 'azure-terraformer';
import { EventEmitter } from 'event-emitter';
import { FileEntry } from 'file-entry-native';
import { hold } from 'hold';
import { unwrap } from 'hold';

/** @type {import('.').Ipp5BackendIdpBuilder.Constructor} */
const constructor = ((options) => {

    const _options = ({
        docker: hold(() => {
            return unwrap(options.docker);
        }),
        appDirectory: hold(() => {
            return unwrap(options.appDirectory);
        }),
        tmpDirectory: hold(() => {
            return unwrap(options.tmpDirectory);
        }),
        runId: hold(() => {
            return unwrap(options.buildId);
        }),
        noCache: hold(() => {
            return unwrap(options.noCache);
        }),
        containerAppGroup: hold(() => {
            return unwrap(options.containerAppGroup);
        }),
        containerAppUser: hold(() => {
            return unwrap(options.containerAppUser);
        }),
        containerAppEntrypoint: hold(() => {
            return unwrap(options.containerAppEntrypoint);
        }),
        containerAppPort: hold(() => {
            return unwrap(options.containerAppPort);
        }),
        containerImageName: hold(() => {
            return unwrap(options.containerImageName);
        }),
        containerAppDirectoryPath: hold(() => {
            return unwrap(options.containerAppDirectoryPath);
        }),
    });

    /** @type {import('.').Ipp5BackendIdpBuilder._Self} */
    const _self = ({
        options: (() => {
            return options;
        }),
        _options: (() => {
            return _options;
        }),
        scriptFile: hold(() => {
            return FileEntry(new URL(import.meta.url).pathname);
        }),
        scriptDirectory: hold(() => {
            return _self.scriptFile().parent();
        }),
        templateDockerfile: hold(() => {
            return _self.scriptDirectory().resolve('Dockerfile.template');
        }),
        runDirectory: hold(() => {
            return _options.tmpDirectory().resolve('ipp5-backend-idp-builder', _options.runId());
        }),
        contextDirectory: hold(() => {
            return _self.runDirectory().resolve('context');
        }),
        contextAppDirectory: hold(() => {
            return _self.contextDirectory().resolve('app');
        }),
        contextDockerfile: hold(() => {
            return _self.contextDirectory().resolve('Dockerfile');
        }),
        contextAppDirectoryRelativePath: hold(() => {
            return _self.contextDirectory().relative(_self.contextAppDirectory()) + '/';
        }),
        azureTerraformer: hold(() => {
            return AzureTerraformer({});
        }),
        makeApp: hold(async () => {
            const src = _options.appDirectory();
            const dest = _self.contextAppDirectory();
            await src.resolve('index.mjs').copyFile(dest.resolve('index.mjs'));
            await src.resolve('package-lock.json').copyFile(dest.resolve('package-lock.json'));
            await src.resolve('package.json').copyFile(dest.resolve('package.json'));
        }),
        makeDockerfile: hold(async () => {
            await _self.azureTerraformer().createFileFromTemplate({
                template: _self.templateDockerfile(),
                destination: _self.contextDockerfile(),
                /** @type {import('.').Ipp5BackendIdpBuilder.DockerfileVariableMap} */
                map: {
                    containerAppGroup: _options.containerAppGroup(),
                    containerAppUser: _options.containerAppUser(),
                    containerAppEntrypoint: _options.containerAppEntrypoint(),
                    containerAppDirectoryPath: _options.containerAppDirectoryPath(),
                    contextAppDirectoryRelativePath: _self.contextAppDirectoryRelativePath(),
                },
            });
        }),
        runDockerImageBuild: hold(async () => {
            await _self.azureTerraformer().dockerImageBuild({
                docker: _options.docker(),
                noCache: _options.noCache(),
                network: 'host',
                tag: _options.containerImageName(),
                context: _self.contextDirectory(),
            });
        }),
    });

    /** @type {import('.').Ipp5BackendIdpBuilder.Self} */
    const self = ({
        ...EventEmitter({}),
        _Ipp5BackendIdpBuilder: (() => {
            return _self;
        }),
        build: hold(async () => {
            await _self.makeApp();
            await _self.makeDockerfile();
            await _self.runDockerImageBuild();
        }),
    });

    return self;

});

/** @type {import('.').Ipp5BackendIdpBuilder.Companion} */
const companion = ({});

/** @type {import('.').Ipp5BackendIdpBuilder.ConstructorWithCompanion} */
const constructorWithCompanion = Object.assign(constructor, companion);

export { constructorWithCompanion as Ipp5BackendIdpBuilder };
