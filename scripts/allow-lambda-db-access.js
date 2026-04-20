const { EC2Client, AuthorizeSecurityGroupIngressCommand } = require("@aws-sdk/client-ec2");

const client = new EC2Client({ region: "af-south-1" });

async function allowAllTraffic() {
  const groupId = "sg-052222e61da2764a4"; // The Cape Town RDS Security Group
  try {
    const data = await client.send(new AuthorizeSecurityGroupIngressCommand({
      GroupId: groupId,
      IpPermissions: [
        {
          IpProtocol: "tcp",
          FromPort: 5432,
          ToPort: 5432,
          IpRanges: [{ CidrIp: "0.0.0.0/0", Description: "Allow Lambda Edge Access" }]
        }
      ]
    }));
    console.log("✅ Security Group updated to allow Lambda access:", data);
  } catch (err) {
    if (err.name === 'InvalidPermission.Duplicate') {
      console.log("✅ Security Group already allows 0.0.0.0/0. No action needed.");
    } else {
      console.error("❌ Error updating security group:", err);
    }
  }
}

allowAllTraffic();
