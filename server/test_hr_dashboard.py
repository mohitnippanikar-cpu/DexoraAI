#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main_model import process_user_query

def test_hr_dashboard_query():
    """Test the HR dashboard query that was being denied due to security risk"""
    
    # Test the specific failing query
    query = "Show me HR dashboard"
    user_id = 1  # HR user with 3 violations
    
    print(f"Testing HR dashboard query for User ID {user_id}")
    print(f"Query: '{query}'")
    print("=" * 60)
    
    result = process_user_query(user_id, query)
    
    print("Result:")
    for key, value in result.items():
        print(f"  {key}: {value}")
    
    # Check if the issue is resolved
    if result.get("is_authorized") == True:
        print("\n✅ SUCCESS: HR user can now access HR dashboard!")
        print(f"✅ Authorization reason: {result.get('auth_reason')}")
    elif result.get("status") == "approved" and result.get("is_authorized") is None:
        print("\n✅ SUCCESS: HR dashboard query approved!")
    else:
        print(f"\n❌ STILL FAILING: Status: {result.get('status')}, Authorized: {result.get('is_authorized')}")
        print(f"❌ Reason: {result.get('auth_reason', result.get('message'))}")
    
    print("=" * 60)

    # Also test a cross-departmental query to make sure HR can still access employee data
    print("\nTesting HR cross-departmental access...")
    cross_dept_query = "View employee data"
    print(f"Query: '{cross_dept_query}'")
    print("-" * 40)
    
    result2 = process_user_query(user_id, cross_dept_query)
    
    print("Result:")
    for key, value in result2.items():
        print(f"  {key}: {value}")
    
    if result2.get("is_authorized") == True:
        print("\n✅ SUCCESS: HR user can access employee data!")
    else:
        print(f"\n❌ ISSUE: HR user cannot access employee data")
        print(f"❌ Reason: {result2.get('auth_reason', result2.get('message'))}")

if __name__ == "__main__":
    test_hr_dashboard_query()
