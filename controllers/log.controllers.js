const { asyncHandler } = require("../utils/asyncHandler");
const { qrCodeModel } = require("../models/qrScan.models.js");
const { Parser } = require("json2csv");

const downloadVisitLogs = asyncHandler(async (req, res) => {
    const visitLogs = await qrCodeModel.find({})
        .populate('createdBy', 'name ruid')
        .populate('scannedBy', 'name guid')
        .lean();

    if (!visitLogs || visitLogs.length === 0) {
        return res.status(404).send("No visit logs found to export.");
    }

    const fields = [
        { label: 'QR Code ID', value: 'qrId' },
        { label: 'Created By Name', value: 'createdBy.name' },
        { label: 'Created By ID', value: 'createdBy.ruid' },
        { label: 'Scanned By Name', value: 'scannedBy.name' },
        { label: 'Scanned By ID', value: 'scannedBy.guid' },
        { label: 'Scanned At', value: 'scannedAt' },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(visitLogs);

    res.header('Content-Type', 'text/csv');
    res.attachment(`visit-logs-${new Date().toISOString()}.csv`);
    return res.send(csv);
});

module.exports = { downloadVisitLogs };