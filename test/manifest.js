/* 
 * This software was developed at the National Institute of Standards and
 * Technology by employees of the Federal Government in the course of
 * their official duties. Pursuant to title 17 Section 105 of the United
 * States Code this software is not subject to copyright protection and is
 * in the public domain. This software is an experimental system. NIST assumes
 * no responsibility whatsoever for its use by other parties, and makes no
 * guarantees, expressed or implied, about its quality, reliability, or
 * any other characteristic. We would appreciate acknowledgement if the
 * software is used.
 */

(function($$) {

    var manifest;

    module("manifest", {
        setup: function() {
            manifest = new $$.Manifest({
                manifest: "data/manifest.json",
                success: function(data) {
                    ok(data, "Manifest data should be accessible in callback.");
                    start();
                },
                error: function(message) {
                    ok(false, "Error while initializing manifest: " + message);
                    start();
                }
            });
            stop();
        }
    });

    asyncTest("createFromJson", function() {
        new $$.Manifest({
            manifest: "data/manifest.json",
            success: function(data) {
                ok(data, "Manifest data should be accessible in callback.");
                start();
            },
            error: function(message) {
                ok(false, "Error while initializing manifest: " + message);
                start();
            }
        });
    });

    asyncTest("createFromObject", function() {
        new $$.Manifest({
            manifest: {layersGroups: []},
            success: function(data) {
                ok(data, "Manifest data should be accessible in callback.");
                start();
            },
            error: function(message) {
                ok(false, "Error while initializing manifest: " + message);
                start();
            }
        });
    });

    asyncTest("createShouldFailIfNoManifestProvided", function() {
        new $$.Manifest({
            manifest: undefined,
            success: function() {
                ok(false, "Creation should fail when manifest not provided.");
                start();
            },
            error: function() {
                ok(true);
                start();
            }
        });
    });

    asyncTest("createShouldFailIfLayersGroupsNotDefined", function() {
        new $$.Manifest({
            manifest: {},
            success: function() {
                ok(false, "Creation should fail when layers groups not defined.");
                start();
            },
            error: function() {
                ok(true);
                start();
            }
        });
    });

    test("getLayersGroups", function() {
        var groups = manifest.getLayersGroups();

        ok(groups instanceof Array, "Layers groups should be an array.");
        equal(groups.length, 8, "There should be 8 layers groups.");
    });

    test("getLayers", function() {
        var allLayers = manifest.getLayers();
        ok(allLayers instanceof Array, "Layers should be an array.");
        equal(allLayers.length, 11, "There should be 11 layers.");

        var firstGroup = manifest.getLayersGroups()[0];
        var firstGroupLayers = manifest.getLayers(firstGroup);
        ok(firstGroupLayers instanceof Array, "Layers should be an array.");
        equal(firstGroupLayers.length, 3, "There should be 3 layers.");

        firstGroupLayers = manifest.getLayers(firstGroup.id);
        ok(firstGroupLayers instanceof Array, "Layers should be an array.");
        equal(firstGroupLayers.length, 3, "There should be 3 layers.");
    });

    test("getLayer", function() {
        var layer = manifest.getLayer("phasecontrast");
        equal(typeof layer, "object", "Layer should be an object.");
    });

    test("getLayerGroup", function() {
        var layer = manifest.getLayer("phasecontrast");
        var group = manifest.getLayerGroup(layer);

        notEqual(group.layers.indexOf(layer), -1, "group should contain layer.");
    });

    test("getFrameUrlFunc", function() {
        var func = manifest.getFrameUrlFunc(manifest.getLayer("phasecontrast"));
        equal(typeof func, "function");
        equal(func(1), "data/stemcells/phasecontrast/stitched_c01t001.dzi");

        var func = manifest.getFrameUrlFunc(manifest.getLayer("moche_single_frame"));
        equal(typeof func, "function");
        equal(func(), "data/moche/xy-energy/slice00098.dzi");
    });

})(WDZT);
