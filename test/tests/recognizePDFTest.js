describe("PDF Recognition", function() {
	var win;
	
	before(function* () {
		if (Zotero.automatedTest) this.skip(); // TODO: Mock services
		
		this.timeout(60000);
		// Load Zotero pane and install PDF tools
		yield Zotero.Promise.all([
			loadZoteroPane().then(w => win = w)
		]);
	});
	
	beforeEach(function* () {
		yield selectLibrary(win);
	});
	
	afterEach(function() {
		for(let win of getWindows("chrome://zotero/content/recognizePDFDialog.xul")) {
			win.close();
		}
		Zotero.RecognizePDF.cancel();
	});
	
	after(function() {
		if (win) {
			win.close();
		}
	});

	it("should recognize a PDF by DOI", async function () {
		this.timeout(30000);
		// Import the PDF
		var testdir = getTestDataDirectory();
		testdir.append("recognizePDF_test_DOI.pdf");
		var attachment = await Zotero.Attachments.importFromFile({
			file: testdir
		});
		
		// Recognize the PDF
		win.ZoteroPane.recognizeSelected();
		
		var addedIDs = await waitForItemEvent("add");
		var modifiedIDs = await waitForItemEvent("modify");
		assert.lengthOf(addedIDs, 1);
		var item = Zotero.Items.get(addedIDs[0]);
		assert.equal(item.getField("title"), "Scaling study of an improved fermion action on quenched lattices");
		assert.lengthOf(modifiedIDs, 2);
		
		// Wait for status to show as complete
		var progressWindow = getWindows("chrome://zotero/content/recognizePDFDialog.xul")[0];
		var completeStr = Zotero.getString("recognizePDF.complete.label");
		while (progressWindow.document.getElementById("label").value != completeStr) {
			await Zotero.Promise.delay(20);
		}
		
		// The file should have been renamed
		assert.equal(
			attachment.attachmentFilename,
			Zotero.Attachments.getFileBaseNameFromItem(item) + '.pdf'
		);
	});
	
	it("should put new item in same collection", async function () {
		this.timeout(30000);
		// Import the PDF
		var testdir = getTestDataDirectory();
		testdir.append("recognizePDF_test_DOI.pdf");
		var collection = await createDataObject('collection');
		var attachment = await Zotero.Attachments.importFromFile({
			file: testdir,
			collections: [collection.id]
		});
		
		win.ZoteroPane.recognizeSelected();
		
		var addedIDs = await waitForItemEvent("add");
		var modifiedIDs = await waitForItemEvent("modify");
		assert.lengthOf(addedIDs, 1);
		var item = Zotero.Items.get(addedIDs[0]);
		assert.lengthOf(modifiedIDs, 2);
		
		// Wait for status to show as complete
		var progressWindow = getWindows("chrome://zotero/content/recognizePDFDialog.xul")[0];
		var completeStr = Zotero.getString("recognizePDF.complete.label");
		while (progressWindow.document.getElementById("label").value != completeStr) {
			await Zotero.Promise.delay(20);
		}
		
		assert.isTrue(collection.hasItem(item.id));
	});
	
	it("should recognize PDF by DOI and put new item in same collection in group library", async function () {
		this.timeout(30000);
		var testdir = getTestDataDirectory();
		testdir.append("recognizePDF_test_DOI.pdf");
		var group = await getGroup();
		var collection = await createDataObject('collection', { libraryID: group.libraryID });
		var attachment = await Zotero.Attachments.importFromFile({
			libraryID: group.libraryID,
			file: testdir,
			collections: [collection.id],
		});
		
		win.ZoteroPane.recognizeSelected();
		
		var addedIDs = await waitForItemEvent("add");
		var modifiedIDs = await waitForItemEvent("modify");
		assert.lengthOf(addedIDs, 1);
		var item = Zotero.Items.get(addedIDs[0]);
		assert.lengthOf(modifiedIDs, 2);
		
		// Wait for status to show as complete
		var progressWindow = getWindows("chrome://zotero/content/recognizePDFDialog.xul")[0];
		var completeStr = Zotero.getString("recognizePDF.complete.label");
		while (progressWindow.document.getElementById("label").value != completeStr) {
			await Zotero.Promise.delay(20);
		}
		
		assert.isTrue(collection.hasItem(item.id));
	});
	
	it.skip("should recognize PDF by ISBN and put new item in same collection in group library", async function () {
		this.timeout(30000);
		var testdir = getTestDataDirectory();
		testdir.append("recognizePDF_test_ISBN.pdf");
		var group = await getGroup();
		var collection = await createDataObject('collection', { libraryID: group.libraryID });
		var attachment = await Zotero.Attachments.importFromFile({
			libraryID: group.libraryID,
			file: testdir,
			collections: [collection.id],
		});
		
		win.ZoteroPane.recognizeSelected();
		
		var addedIDs = await waitForItemEvent("add");
		var modifiedIDs = await waitForItemEvent("modify");
		assert.lengthOf(addedIDs, 1);
		var item = Zotero.Items.get(addedIDs[0]);
		assert.lengthOf(modifiedIDs, 2);
		
		// Wait for status to show as complete
		var progressWindow = getWindows("chrome://zotero/content/recognizePDFDialog.xul")[0];
		var completeStr = Zotero.getString("recognizePDF.complete.label");
		while (progressWindow.document.getElementById("label").value != completeStr) {
			await Zotero.Promise.delay(20);
		}
		
		assert.isTrue(collection.hasItem(item.id));
	});
	
	it("should recognize PDF by title and put new item in same collection in group library", async function () {
		this.timeout(30000);
		var testdir = getTestDataDirectory();
		testdir.append("recognizePDF_test_title.pdf");
		var group = await getGroup();
		var collection = await createDataObject('collection', { libraryID: group.libraryID });
		var attachment = await Zotero.Attachments.importFromFile({
			libraryID: group.libraryID,
			file: testdir,
			collections: [collection.id],
		});
		
		win.ZoteroPane.recognizeSelected();
		
		var addedIDs = await waitForItemEvent("add");
		var modifiedIDs = await waitForItemEvent("modify");
		assert.lengthOf(addedIDs, 1);
		var item = Zotero.Items.get(addedIDs[0]);
		assert.lengthOf(modifiedIDs, 2);
		
		// Wait for status to show as complete
		var progressWindow = getWindows("chrome://zotero/content/recognizePDFDialog.xul")[0];
		var completeStr = Zotero.getString("recognizePDF.complete.label");
		while (progressWindow.document.getElementById("label").value != completeStr) {
			await Zotero.Promise.delay(20);
		}
		
		assert.isTrue(collection.hasItem(item.id));
	});
});